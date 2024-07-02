// most of the code here was adapted from
// https://github.com/mdn/serviceworker-cookbook/blob/master/push-simple/service-worker.js
// https://github.com/gauntface/simple-push-demo/

// due to a bug in iOS Safari https://bugs.webkit.org/show_bug.cgi?id=268797
// a PWA can't
// - detect if it is "visible",
//   so it can't decide whether a (push) notification is really necessary,
//   so all push notification will be visible&audible
//   until the bug is fixed
// - keep a state communicated by its "client" (the non-service-worker part)
//   via postMessage (BroadcastChannel or "simple self"),
//   see code below
// - react appropriately to notificationclick

console.log('SW')

// const projectId = self.location.pathname.split('/')[2]
// console.log('SW', projectId)
// const broadcastChannel = new BroadcastChannel('interkit_' + projectId)

// Register event listener for the 'push' event.
self.addEventListener('push', async function (event) {
  let clients = await self.clients.matchAll() // this will be [] on iOS
  if (clients && clients.length) {
    if (clients[0].visibilityState === 'visible') {
      console.log('SW client[0] visible, suppressing notification')
      return
    }
  }
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data ? event.data.text() : '—';
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // we'll use the message text as title, since it's mandatory
    // the prominence of the title varies on Android vs iOS, so test and judge for your case
    self.registration.showNotification(
      payload
      // you can customize the user-facing notification here
      // see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
      // '💌 Message', { body: payload, icon: … }
    )
  );
});

// this seems superfluous on iOS
self.addEventListener('notificationclick', function (event) {
  console.log('SW notificationclick')
  event.notification.close()
  let clickResponsePromise = Promise.resolve()
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url)
  }
  event.waitUntil(clickResponsePromise)
})

// listen to messages sent from pushweb.js via `navigator.serviceWorker.controller.postMessage`
// alternatively, use `broadcastChannel.addEventListener`
// self.addEventListener('message', function (event) {
//   switch (event.data?.method) {
//     case 'setWebPushNotificationTitle':
//     webPushNotificationTitle = event.data.payload
//      break
//  }
// })

self.addEventListener('install', e => {
  console.log('SW install')
  self.skipWaiting();
})

