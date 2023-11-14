import { tick } from 'svelte'

import {
  secondaryTabIndex,
  secondaryTabsHidden,
  secondaryTabsMinimized,
  secondaryTabSpecialDoc
} from './admin.js'

let iframe

export const registerIframe = element => {
  iframe = element
}

export const docsGo = async (routeOrDirection) => {
  secondaryTabsHidden.set(false)
  secondaryTabsMinimized.set(false)
  secondaryTabIndex.set(1)
  secondaryTabSpecialDoc.set(false)
  /* wait until the iframe is in DOM */
  await tick()
  if (!iframe?.contentWindow?.postMessage) {
    console.warn('docsGo called, but no iframe', { iframe, contentWindow: iframe?.contentWindow, postMessage: iframe?.contentWindow?.postMessage })
    return
  }
  const routeIsUrl = typeof routeOrDirection === 'string'
  const method = routeIsUrl
    ? 'docsGo'
    : (routeOrDirection <= 0 ? 'routerHistoryBack' : 'routerHistoryForward')
  iframe.contentWindow.postMessage(
    {
      method,
      ...(routeIsUrl ? { route: routeOrDirection } : {})
    },
    '*' // not security-critical
  )
}

const localDocsURL = "http://localhost:3010"
const remoteDocsURL = "https://docs.interkit.app"
export const docsURL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? localDocsURL : remoteDocsURL;
