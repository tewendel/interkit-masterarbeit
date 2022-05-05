<script>

  import { InterkitClient } from '../'
  import { executeTrigger } from '../actions.js'
  import { onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store';

  import Styling from './Styling.svelte'
  import Overlay from './Overlay.svelte'

  let initComplete = false;

  let userId = InterkitClient.userId

  const bypassDesktopFallback = /\bbypassDesktopFallback=1\b/.test(document.location.search + document.location.hash)
  const desktopMQ = '(min-width: 600px)';
  const isDesktop = writable(!bypassDesktopFallback && window.matchMedia?.(desktopMQ)?.matches);
  setContext('isDesktop', isDesktop)
  
  onMount(async ()=>{
    initComplete = await InterkitClient.initApp()  
    executeTrigger("start")
    // we're doing this here, maybe again, to be sure,
    // because the async interdependencies
    // (capacitor plugin, interkit client, meteor)
    // are hard to get completely right
    InterkitClient.saveUserPushnotificationRegistrationToken()
  });

  // tell frame parent (=admin) the userId
  // TODO check if we're not leaking a secret, if so, take special precautions
  // like adding an extra (querystring) param to signal that app is running within iframe
  // esp. the '*' targetOrigin is not very safe (would replacing the port be OK?)
  $: window.parent.postMessage({ userId: $userId }, '*')

  let config = InterkitClient.config;
  let projectId = InterkitClient.projectId;
  let connectionIssue = InterkitClient.connectionIssue;

  import { Plugins } from '@capacitor/core';
  const { SplashScreen } = Plugins;
  import * as pushNotifications from '../pushnotifications.js'

  (async () => {
    console.log('pushNotifications...')
    pushNotifications.startHeartbeat()
    await pushNotifications.addListeners()
    await pushNotifications.registerNotifications()
      .then(async () => {
        console.log('pushNotifications addListeners...')
        await pushNotifications.getDeliveredNotifications()
      })
      .catch(e => {
        console.error('pushNotifications', e)
        InterkitClient.pushnotificationRegistrationToken.set('(web)')
      })
  })()

  $: {
    if(initComplete) {
      SplashScreen.hide()  
    }

  }

  const retry = () => {
    window.location.reload(true);
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

  function receiveMessage(event) {
    switch (event.data) {
      case "go_back": history.back(); break;
      case "go_forward": history.forward(); break;
      case "clear_localStorage": localStorage.clear(); break;
    }
  }

  
</script>

<svelte:window on:popstate={popState} on:message={receiveMessage} />

<div class="AppBase Theming" id="Theming">
  <Styling>
    <Overlay zIndex={0}>
      {#if $projectId && initComplete}
        {#if $$slots.desktopFallback && $isDesktop}
          <slot name="desktopFallback" />
        {:else}
          <slot ></slot>
          <slot name="viewport"></slot>
        {/if}
      {:else}
        <div class="Loading">
          <p class="static-loading-indicator">laden....</p>
          {#if $connectionIssue}
          <button class="network-reload" on:click={retry}>verbinden</button>
          {/if}
        </div>
      {/if}
    </Overlay>
  </Styling>
</div>

<style>
  .AppBase {
    height: 100%;
    pointer-events: all;
    touch-action: auto;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  
    box-sizing: border-box;
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

  /* default font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
  :global(body) {
    font-family: 'Inter', sans-serif;
  }

  :global(h2) {
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;
  }

  :global(h3) {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
  }


</style>

<!-- reset styles -->

<svelte:head>
  <title>{$config?.project_slug}</title>

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

    /* Styling for loading indikator */
    .Loading {
      padding: 20px;
    }
    .Loading button {
      padding: 5px;
      margin-top: 5px;
    }

  </style>
</svelte:head>
