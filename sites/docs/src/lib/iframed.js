import { goto } from '$app/navigation'

const logPrefix = 'interkit docs iframed'

console.info(logPrefix, 'init')

const setupClientside = window => {
  window.addEventListener('message', evt => {
    if (!evt?.data) {
      console.warn(logPrefix, 'message received, but no data, bailing')
      return
    }
    console.log('interkit docs iframed message event', evt)
    switch (evt.data?.method) {
      case 'docsGo':
        goto(evt.data.route)
        break
      case undefined:
        console.warn(logPrefix, 'message received, but no method?', evt.data)
        break
      default:
        console.warn(logPrefix, 'message received, but unknown method?', evt.data)
    }
  })
}

try {
  if (typeof window !== 'undefined') {
    setupClientside(window)
  } else {
    console.log('interkit docs iframed, no window object')
  }
} catch (e) {
  console.log('interkit docs iframed, probably no window object')
}

export default {
  test: () => window.alert('foo')
}
