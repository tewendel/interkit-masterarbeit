<script>

  import { Capacitor } from '@capacitor/core'
  import { Network } from '@capacitor/network'
  import { SplashScreen } from '@capacitor/splash-screen'

  import { InterkitClient } from '../'
  import { executeTrigger } from '../actions.js'
  import { translations, lang, setupFrontend } from '../i18n.js'
  import { onMount, setContext } from 'svelte'
  import { get, writable } from 'svelte/store';

  import Router from './Router.svelte'
  import Styling from './Styling.svelte'
  import Overlay from './Overlay.svelte'
  
  export let languages
  export let enableWebPush
  export let projectIdOverride
  languages = languages && languages.split ? languages.split(',') : false
  setupFrontend(languages)

  enableWebPush = enableWebPush === true || enableWebPush === 'TRUE'

  const setHtmlLang = langCode => {
    document.documentElement.setAttribute('lang', langCode)
  }

  // langT is a overly fail-safe reactive array to the translations
  // we try to make it available as soon as possible, but since it
  // depends on a server connection, it is likely not there yet
  // in the init stage, especially when there is no internet connection
  // in a less critical context, we would use the simpler t function
  let langT
  lang.subscribe(activeLang => {
    const derivedLang = activeLang || languages?.[0] || 'en'
    langT = get(translations)?.[derivedLang]
    setHtmlLang(derivedLang)
  })

  if (get(lang)) setHtmlLang(get(lang))

  let initComplete = false;

  let userId = InterkitClient.userId

  const bypassDesktopFallback = /\bbypassDesktopFallback=1\b/.test(document.location.search + document.location.hash)
  const desktopMQ = '(min-width: 600px)';
  const isDesktop = writable(!bypassDesktopFallback && window.matchMedia?.(desktopMQ)?.matches);
  setContext('isDesktop', isDesktop)

  let overrideStyleTokens

  let retryCountdownCounter = 20

  const retryCountdown = () => {
    if (retryCountdownCounter <= 1) {
      retry()
      return
    }
    retryCountdownCounter--
    window.setTimeout(retryCountdown, 1000)
  }

  const checkRetryCountdown = () => {
    console.log('AppBase', { issue: get(connectionIssue), projectId: get(projectId), initComplete })
    if (get(connectionIssue) && !(get(projectId) && initComplete)) {
      retryCountdown()
    }
  }

  const retry = () => {
    window.location.reload(true);
  }

  window._Network = Network

  let showNetworkHint = false
  let showNetworkHintConnection = false
  let showNetworkHintNetwork = false

  // the last term (and not not...) equals "show the retry button"
  // i.e. when we have the retry button, we don't need the hint
  // (which, as overlay, could block the button)
  $: showNetworkHint = (showNetworkHintConnection || showNetworkHintNetwork) && !(!($projectId && initComplete) && connectionIssue)

  Network.addListener('networkStatusChange', ({ connected }) => {
    console.log('AppBase networkStatusChange', { connected, issue: get(connectionIssue) })
    showNetworkHintNetwork = !connected
    if (get(connectionIssue) && connected) {
      console.log('AppBase retry because regained connection')
      retry()
    }
  })
  
  onMount(async ()=>{
    initComplete = await InterkitClient.initApp({projectId: projectIdOverride})  
    executeTrigger("start")
    // we're doing this here, maybe again, to be sure,
    // because the async interdependencies
    // (capacitor plugin, interkit client, meteor)
    // are hard to get completely right
    InterkitClient.saveUserPushnotificationRegistrationToken()
    checkRetryCountdown()
  });

  let config = InterkitClient.config;
  let projectId = InterkitClient.projectId;
  let connectionIssue = InterkitClient.connectionIssue;
  let clientConnected = InterkitClient.connected;

  let postMessageOrigin
  $: {
    postMessageOrigin = $config?.INTERKIT_ADMIN_URL
    if (postMessageOrigin) {
      console.log('AppBaseAdvanced postMessageOrigin set, processing queue', JSON.stringify(postMessageQueue))
      while (postMessageQueue.length) {
        // shift() = first in, first out = in the order they were queued = "reproduce history"
        const payload = postMessageQueue.shift()
        // console.log('AppBaseAdvanced postMessageOrigin set, processing queue, payload', JSON.stringify(payload))
        postMessage(payload)
      }
    }
  }

  const postMessageQueue = []

  const postMessage = payload => {
    if (window.parent === window) {
      console.log('AppBaseAdvanced postMessage not in iframe, bailing')
      return
    }
    // Messages can come in before postMessageOrigin is set.
    // Sending them would result in an exception, so we queue them for later (see above)
    if (!postMessageOrigin) {
      postMessageQueue.push(payload)
      console.log('AppBaseAdvanced postMessage, but Origin not set (yet?) from config, queued', JSON.stringify(postMessageQueue))
      return
    }
    try {
      window.parent.postMessage(payload, postMessageOrigin)
    } catch (e) {
      console.error(
        'Inter-frame communication failed. Are you running interkit on non-standard ports? Check your script blockers?',
        { postMessageOrigin, payload }
      )
    }
  }

  $: {
    // if we're in an iframe, tell frame parent (=admin) the userId
    postMessage({ userId: $userId })
  }

  connectionIssue.subscribe(value => {
    checkRetryCountdown()
  })

  // when connection to server is lost, we delay feedback to get around two "false positives":
  // 1. short after "onload", 2. right before "unload" (e.g. before a refresh)
  let showNetworkHintConnectionDelay

  clientConnected.subscribe(value => {
    console.log('AppBase client connected subscription', value)
    // clear any outstanding "queued" update
    if (showNetworkHintConnectionDelay) { 
      window.clearTimeout(showNetworkHintConnectionDelay)
    }
    if (value) {
      // connection good/back, show immediately
      showNetworkHintConnection = false
    } else {
      // connection bad/gone, delay showing it
      showNetworkHintConnectionDelay = window.setTimeout(() => {
        showNetworkHintConnection = true
      }, 3000)
    }
  })

  import * as pushNotifications from '../pushnotifications.js'

  (async () => {
    console.log('pushNotifications...')
    if (!pushNotifications.isPushNotificationsAvailable()) {
      console.log('pushNotifications not available (web)')
      return
    }
    pushNotifications.startHeartbeat()
    await pushNotifications.addListeners()
    await pushNotifications.registerNotifications()
      .then(async () => {
        console.log('pushNotifications addListeners...')
        await pushNotifications.getDeliveredNotifications()
        pushNotifications.removeAllDeliveredNotifications()
        console.log('removeAllDeliveredNotifications after register')
      })
      .catch(e => {
        console.error('pushNotifications', e)
        InterkitClient.pushnotificationRegistrationToken.set('(web)')
      })
    /* app becomes visible */
    document.addEventListener('visibilitychange', () => {
      console.log('removeAllDeliveredNotifications b/c visibilitychange')
      pushNotifications.removeAllDeliveredNotifications()
    })
  })()

  import * as pushWeb from '../pushweb.js'

  if (!enableWebPush) {
    console.log('webpush: disabled by AppBaseAdvanced')
  } else {
    console.log('webpush: enabled by AppBaseAdvanced')
    try {
      console.log('webpush: register serviceWorker sw.js SW')
      navigator.serviceWorker.register('sw.js')
        .then(r => console.log('webpush: serviceWorker registered', r))
        .catch(e => console.log('webpush: serviceWorker registration failed', e))
      pushWeb.init()
    } catch (e) {
      console.warn('webpush: serviceWorker.register failed', e)
    }
  }

  $: {
    if(initComplete) {
      SplashScreen.hide()  
    }

  }

  function popState(event) {
    if (event && event.state && event.state.id) {
      const result = InterkitClient.restoreUiSnapshot(event.state.id)
      if (result === false) {
        history.back()
      }
    } else {
      history.back()
    }
  }

  async function changeUser(userAuth) {
    console.log("set_userId request", userAuth);
    await InterkitClient.loginTokenUser(userAuth);
    window.location.reload();
  }

  /* handle server reset requests */
  InterkitClient.userProjectDataStore.subscribe(async (data) => {
    // console.log('AppBaseAdvanced userProjectDataStore sub', data)
    if (data?.userVars?.resetRequested === true) {
      // new Date didn't work for some reason
      const res = await InterkitClient.setUserVar('resetRequested', Date.now())
      console.log('AppBaseAdvanced userProjectDataStore, result', res)
      localStorage.clear()
      window.location.reload()
    }
  })

  function receiveMessage(event) {
    console.log('AppBaseAdvanced in iframe, receiveMessage', event?.data?.command, event?.data?.payload, event)
    switch (event.data?.command) {
      /* This doesn't work in an iframe because the history is mixed/merged with the parent's
       * it only happens to work if the last navigation took place within the iframe
       * otherwise it "leaks" and the parent goes back, e.g. to about:blank or your home tab.
       * To make this work, it would have to hook into svelte routing, which doesn't exist yet.
      case "go_back": history.back(); break;
      case "go_forward": history.forward(); break;
      */
      case "clear_localStorage": localStorage.clear(); break;
      case "set_userAuth": if(event.data?.payload) { changeUser(event.data?.payload) }; break; // admin requests preview for a user
      case "set_overrideStyleTokens":
        overrideStyleTokens = event.data?.payload
        break
    }
  }

  // subscribe to global audio player status and load media file on changes
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  let mediafileAudio;
  const loadAudiofile = async (key) => {
    console.log("AppBase loadAudioFile", $audioPlayerStatus)
    if(key) {
      mediafileAudio = await InterkitClient.getMediaFile(key)
      console.log("got mediafileAudio", mediafileAudio)
    } else {
      mediafileAudio = null;
    }
  }
  $: audioKey = $audioPlayerStatus?.audioKey
  $: {
    console.log("AppBaseAdvanced audioKey", audioKey)
    loadAudiofile(audioKey)
  }

  
</script>

<svelte:window on:popstate={popState} on:message={receiveMessage} />

<div class="AppBase AppBaseAdvanced Theming" id="Theming">
  <Router {postMessage} {projectId}>
    <Styling
      isRootStyling
      {overrideStyleTokens}
      >
      <Overlay
        zIndex={0}
        customStyle={
          `bottom: ${showNetworkHint && !($$slots.networkHint) ? 'var(--network-hint-height)' : '0'};`
        }
        >
        {#if $projectId && initComplete}
          {#if $$slots.desktopFallback && $isDesktop}
            <slot name="desktopFallback" />
          {:else}
            <slot ></slot>
            <slot name="viewport"></slot>
          {/if}
        {:else}
          <div class="Loading">
            {#if $connectionIssue}
              <p>{langT['$init_noconnection']}</p>
              <p>
                <button class="network-reload" on:click={retry}>{langT['$init_retryconnection']}</button><br/>
                {langT['$init_retrycountdown'].replace('%s', retryCountdownCounter)}
              </p>
            {:else}
              <p class="static-loading-indicator">{langT['$init_loading']}</p>
            {/if}
          </div>
        {/if}
      </Overlay>
      {#if showNetworkHint}
        {#if $$slots.networkHint}
          <div class="network-hint network-hint--custom">
            <slot name="networkHint"></slot>
          </div>
        {:else}
          <div class="network-hint network-hint--default">
            <div class="network-hint-message">
              {#if showNetworkHintNetwork}
                {langT['$appbase_noconnection_network']}
              {:else if showNetworkHintConnection}
                {langT['$appbase_noconnection_server']}
              {:else}
                {langT['$appbase_noconnection_error']}
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    </Styling>
  </Router>

  {#key mediafileAudio}
    {#if mediafileAudio}
      <span class="AppBase__audioplayer audio-player">
        <audio 
          id="audio"
          controls
          on:playing={() => { 
            if($audioPlayerStatus.loading) {
              audioPlayerStatus.update(s=>({...s, loading: false}))
              //console.log("playing")
            }
          }}
          bind:currentTime={$audioPlayerStatus.currentTime}
          bind:duration={$audioPlayerStatus.duration}
          bind:paused={$audioPlayerStatus.paused} 
          autoplay={$audioPlayerStatus.autoplay}
        >
          <source src={encodeURI(mediafileAudio.link)} type="audio/mpeg">
        </audio>
      </span>
    {/if}
  {/key}

</div>

<style>

  /* default font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

  /* following styles outside of Styling, so no vars */

  .AppBase {
    height: 100%;
    pointer-events: all;
    touch-action: auto;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  
    box-sizing: border-box;
    --network-hint-height: 2rem;
  }

  :global(html) {
    /*min-height: calc(100% + env(safe-area-inset-top));*/
  }

  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    pointer-events: none;
    touch-action: none;
  }

  :global(body) {
    font-family: 'Inter', sans-serif;
  }

  :global(h2) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 400;
  }

  :global(h3) {
    font-size: 1.25rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  .network-reload {
    border: 1px solid black;
    padding: 1rem;
    margin: 1rem 0;
  }

  .network-hint--default {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--network-hint-height);
    background: black;
    color: white;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .network-hint--default .network-hint-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 2em);
    height: var(--network-hint-height);
    line-height: var(--network-hint-height);
  }

  .audio-player, audio {
    display:none;
  }

</style>

<!-- reset styles -->

<svelte:head>
  <title>{$config?.project_slug}</title>

  {#if $config?.INTERKIT_APP_LOAD_THEME}
    <link rel='stylesheet' href="theme/global.css">
    <script defer src="theme/global.js"></script>
  {/if}

  <style>
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary, button,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    /* headlines not bold */
    h1, h2, h3, h4, h5 {
      font-weight: normal;
    }

    /* buttons no special */
    button {
      background-color: transparent;
      border-radius: 0;
      border-style: none;
    }

    /* Make images easier to work with */
    img {
      max-width: 100%;
      display: block;
    }

    /* Inherit fonts for inputs and buttons */
    input,
    button,
    textarea,
    select {
      font: inherit;
    }

    /* Remove all animations and transitions for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* Styling for loading indicator */

    .Loading {
      padding: 1.25rem;
    }

    .Loading button {
      padding: 0.25rem;
      margin-top: 0.25rem;
    }

  </style>
</svelte:head>
