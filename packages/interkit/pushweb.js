import { InterkitClient } from './'
import { get } from 'svelte/store';

console.log('webpush: loaded')

const setup = () => {
  const userId = get(InterkitClient.userId)
  const publicKey = get(InterkitClient.webPushPublicKey)
  if (!userId || !publicKey) {
    console.log('webpush: setup, userId or publicKey missing, bailing gracefully', { userId, publicKey })
    return
  }
  console.log('webpush: setup')
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
      })
  } catch (e) {
    console.warn('webpush: setup failed', JSON.stringify(e), e)
  }
}

const init = () => {
  // we need "both"; the listener will bail gracefully if the other is not set yet
  InterkitClient.webPushPublicKey.subscribe(() => setup())
  InterkitClient.userId.subscribe(() => setup())
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
