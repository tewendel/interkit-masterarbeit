import { secondaryTabIndex, secondaryTabsVisible } from './admin.js'

let iframe

export const registerIframe = element => {
  iframe = element
}

export const docsGo = (route) => {
  if (!iframe) {
    console.warn('docsGo called, but no iframe')
  }
  secondaryTabsVisible.set(true)
  secondaryTabIndex.set(1)
  iframe.contentWindow.postMessage(
    {
      method: 'docsGo',
      route
    },
    '*'
  )
}

const localDocsURL = "http://localhost:3010"
const remoteDocsURL = "https://docs.interkit.app"
export const docsURL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? localDocsURL : remoteDocsURL;
