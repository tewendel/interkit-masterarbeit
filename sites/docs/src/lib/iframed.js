import { goto, afterNavigate, beforeNavigate, disableScrollHandling } from '$app/navigation'
import { tick } from 'svelte'
import { writable } from 'svelte/store'

const logPrefix = 'interkit docs iframed'

let isIframed

console.info(logPrefix, 'init')

let routerHistory = []
let routerHistoryPointer = -1
let routerRestoreScroll = false
let routerCanForward = writable(false)
let routerCanBack = writable(false)

const setupHistory = () => {
  beforeNavigate(() => {
    pushRouterHistoryScroll()
  })
  afterNavigate(async ({ to, from, type }) => {
    switch (type) {
      case 'load':
      case 'link':
        pushRouterHistory(to.url)
        break
      case 'goto':
      case 'popstate':
      case 'form':
      case 'leave':
      default:
        console.log('### afterNavigate ignore type', type)
    }
    if (routerRestoreScroll) {
      // disableScrollHandling()
      await tick()
      window.setTimeout(() => {
        console.log('### afterNavigate restore scroll', routerRestoreScroll.top, document.documentElement.scrollHeight)
        document.documentElement.scrollTop = routerRestoreScroll.top
        // somehow setting left also breaks everything :(
        // document.documentElement.scrollLeft = routerRestoreScroll.left
        routerRestoreScroll = false
      }, 100)
    }
    console.log('### afterNavigate history:', routerHistory)
  })
}

const pushRouterHistoryScroll = () => {
  if (!routerHistory.length) return
  const scroll = {
    top: document.documentElement.scrollTop,
    left: document.documentElement.scrollLeft
  }
  routerHistory[routerHistory.length - 1].scroll = scroll
}

const pushRouterHistory = route => {
  routerHistory.splice(routerHistoryPointer + 1)
  routerHistory.push({
    route
  })
  routerHistoryPointer++
  updateCanNavigate()
}

const routerHistoryBack = () => {
  // routerHistory.pop()
  // const lastRoute = routerHistory?.[routerHistory.length - 1]
  if (routerHistoryPointer < 1) return
  const lastRoute = routerHistory[routerHistoryPointer - 1]
  console.log('### routerHistoryBack', routerHistory, routerHistoryPointer)
  if (!lastRoute) return
  console.log('### routerHistoryBack', lastRoute, routerHistory)
  routerRestoreScroll = lastRoute.scroll
  goto(lastRoute.route, { replaceState: true })
  routerHistoryPointer--
  updateCanNavigate()
}

const routerHistoryForward = () => {
  const nextRoute = routerHistory[routerHistoryPointer + 1]
  if (!nextRoute) return
  routerRestoreScroll = nextRoute.scroll
  goto(nextRoute.route, { replaceState: true })
  routerHistoryPointer++
  updateCanNavigate()
}

const updateCanNavigate = () => {
  routerCanBack.set(routerHistoryPointer > 0)
  routerCanForward.set(routerHistoryPointer <= routerHistory.length - 2)
}

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
        pushRouterHistory(evt.data.route)
        goto(evt.data.route)
        break
      case 'routerHistoryBack':
        routerHistoryBack()
        break
      case 'routerHistoryForward':
        routerHistoryForward()
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
  isIframed,
  setupHistory,
  routerHistoryBack,
  routerHistoryForward,
  routerCanForward,
  routerCanBack
}
