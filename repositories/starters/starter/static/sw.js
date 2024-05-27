// most of the code here was adapter from the MDN ServiceWorker Cookbook
// https://github.com/mdn/serviceworker-cookbook/blob/master/push-simple/service-worker.js

console.log('SW')

const projectId = self.location.pathname.split('/')[2]

console.log('SW', projectId)

const broadcastChannel = new BroadcastChannel('interkit_' + projectId)

var showWebPushNotification
// self.showWebPushNotification
var webPushNotificationTitle = 'interkit'

broadcastChannel.onmessage = event => {
  console.log('SW broadcastChannel event', event.data)
  switch (event.data.method) {
    case 'setShowWebPushNotification':
      showWebPushNotification = event.data.payload
      // self.showWebPushNotification = event.data.payload
      break
    case 'setWebPushNotificationTitle':
      webPushNotificationTitle = event.data.payload
      break
  }
}


// TODO: does this need the project id?
// TODO: figure out if we ever need to update it
//       maybe make this v04 etc.,
//       mirroring the version of the starter?
const cacheKey = projectId + '_v1'

// TODO: this setup is pseudo; it just have to be "eligible for PWA"
//       (maybe this is even unnecessary)
const cachePath = './'
const cacheFiles = [
    cachePath + 'index.html',
]

self.addEventListener('install', e => {
    console.log('SW install')
    e.waitUntil((async () => {
        const cache = await caches.open(cacheKey)
        console.log('SW caches open', cacheKey, cacheFiles)
        await cache.addAll(cacheFiles)
        console.log('SW added', cacheFiles)
    })())
})

self.addEventListener('fetch', e => {
    console.log('SW fetch', e.request.url)
    e.respondWith((async () => {
        const r = await caches.match(e.request)
        if (r) {
            console.log('SW found', e.request.url, r)
            return r
        }
        console.log('SW cache miss', e.request.url)
          const response = await fetch(e.request);
          // wont be needing this for interkit, i think
          // const cache = await caches.open(cacheKey);
          // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
          //cache.put(e.request, response.clone());
          return response;
    })())
})

// clear old caches
self.addEventListener("activate", (e) => {
  console.log('SW activate, clearing old caches, keep', cacheKey)
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheKey) {
            console.log('SW cache delete', key)
            return caches.delete(key)
          }
          console.log('SW cache keeping', key)
        }),
      );
    }),
  );
});

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  console.log('SW received push', showWebPushNotification)
  if (!showWebPushNotification) {
    console.log('SW received push, but set to ignore, would bail')
    return
  }
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data ? event.data.text() : '—';
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification(webPushNotificationTitle || '(interkit)', { //TODO inject from webmanifest? how does this look when installed?
      body: payload,
    })
  );
});
