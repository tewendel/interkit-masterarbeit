import { InterkitClient } from './'
import { get } from 'svelte/store';

console.log('webpush: loaded')

/* broadcast channel is not needed to update tab visibility and set notification title,
 * it is also unreliable/broken on iOS currently (see starter's sw.js)
 * but might be useful in the future
 * or, use the simpler `navigator.serviceWorker.controller.postMessage` scheme
 */
// var broadcastChannel

const setup = (isRetry) => {
  const userId = get(InterkitClient.userId)
  const publicKey = get(InterkitClient.webPushPublicKey)
  if (!userId || !publicKey) {
    console.log('webpush: setup, userId or publicKey missing, bailing gracefully', { userId, publicKey, isRetry })
    return
  }
  console.log('webpush: setup', { isRetry })
  if (!navigator.serviceWorker) {
    console.warn('webpush: setup, no serviceWorker, bailing. Are you running in a secure context, https?', { 'navigator.serviceWorker': navigator.serviceWorker })
    return
  }
  try {
    navigator.serviceWorker.ready
      .then(registration => register(registration, publicKey))
      .then(subscription => subscribe(subscription))
      .then(saveResult => {
        if (saveResult === 1) {
          console.log('webpush: subscription and save successful')
        } else {
          throw new Error('save not successful', saveResult)
        }
      })
      .catch(e => {
        console.error('webpush: registration/subscription error', e)
        if (isRetry) {
          console.error('webpush: setup retry failed, giving up')
        } else {
          // here we know that uesrId and publicKey are there
          // TODO: could additionally check for NotAllowedError
          console.log('webpush: setup error, will retry after gesture (on click)')
          document.addEventListener('click', () => {
            console.log('webpush: got gesture, retrying setup')
            setup(true)
          }, { once: true })
        }
      })
  } catch (e) {
    console.warn('webpush: setup failed', JSON.stringify(e), e)
  }
}

/* broadcast channel setup, see above
const setupBroadcastChannel = projectId => {
  broadcastChannel = new BroadcastChannel('interkit_' + projectId)
  console.log('webpush: setupBroadcastChannel', projectId, broadcastChannel)
  document.addEventListener('visibilitychange', () => {
    const isTabHidden = document.visibilityState === 'hidden' ||
      document.webkitVisibilityState === 'hidden' ||
      document.hidden === true
    console.log('webpush: visibilitychange, posting setShowWebPushNotification', isTabHidden)
    broadcastChannel.postMessage({
      method: 'setShowWebPushNotification',
      payload: isTabHidden
    })
  })
  const postTitle = () => broadcastChannel.postMessage({
    method: 'setWebPushNotificationTitle',
    payload: InterkitClient?.config?.project_slug || 'interkit'
  })
  postTitle()
  InterkitClient.config.subscribe(() => postTitle())
}
*/

const init = () => {
  // if (get(InterkitClient.webPushPublicKey) && get(InterkitClient.userId)) {
  //   console.log('webpush: init, got webPushPublicKey and userId immediately, calling setup')
  //   setup()
  // } else {
  // we need "both"; the listener will bail gracefully if the other is not set yet
  InterkitClient.webPushPublicKey.subscribe(() => setup())
  InterkitClient.userId.subscribe(() => setup())
  // }
  /* broadcast channel setup, see above
  if (get(InterkitClient.projectId)) {
    console.log('webpush: got projectId immediately')
    setupBroadcastChannel(get(InterkitClient.projectId))
  } else {
    console.log('webpush: didnt get projectId immediately, subscribing')
    InterkitClient.projectId.subscribe(projectId => {
      if (!projectId) return
      setupBroadcastChannel(projectId)
    })
  }
  */
}

const register = (registration, vapidPublicKey) => {
  console.log('webpush: register')
  // Use the PushManager to get the user's subscription to the push service.
  return registration.pushManager.getSubscription()
  .then(async function(subscription) {
    // If a subscription was found, return it.
    if (subscription) {
      return subscription;
    }

    // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
    // urlBase64ToUint8Array() is defined in /tools.js
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
    // send notifications that don't have a visible effect for the user).
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
  });
}

const subscribe = async (subscription) => {
  console.log('webpush: subscribe', subscription)
  return InterkitClient.saveUserWebPushSubscription(JSON.stringify(subscription))
};

/* from mozilla serviceworker-cookbook */
// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
 
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export {
  init
}
