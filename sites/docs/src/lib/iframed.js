import { goto } from '$app/navigation'

const logPrefix = 'interkit docs iframed'

let isIframed

console.info(logPrefix, 'init')

const setupClientside = (window, document) => {
  try {
    isIframed = window.self !== window.top
    // isIframed = window !== window.parent
  } catch (e) {
    console.warn(logPrefix, 'isIframe detection failed')
    isIframed = false
  }
  if (isIframed) {
    document.documentElement.classList.add('iframed')
  }
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

// TODO will this work with ssr/prerendering?
try {
  if (typeof window !== 'undefined') {
    setupClientside(window, document)
  } else {
    console.log('interkit docs iframed, no window object')
  }
} catch (e) {
  console.log('interkit docs iframed, probably no window object')
}

export {
  isIframed
}
