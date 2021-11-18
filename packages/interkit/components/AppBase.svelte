<script>

  import { InterkitClient } from '../'
  import { executeTrigger } from '../actions.js'
  import { onMount } from 'svelte'

  import Styling from './Styling.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let fallbackTitle;
  export let fallbackText;
  export let fallbackQrImageSrc;

  let initComplete = false;

  const bypassDesktopFallback = /\bbypassDesktopFallback=1\b/.test(document.location.search + document.location.hash)
  const desktopMQ = '(min-width: 600px)';
  let isDesktop = !bypassDesktopFallback && window.matchMedia?.(desktopMQ)?.matches
  let fallbackIframeSrc = `//${document.location.host}${document.location.pathname}${document.location.search?document.location.search:'?'}&desktop=1${document.location.hash}`
  
  onMount(async ()=>{
    initComplete = await InterkitClient.initApp()  
    executeTrigger("start")
  });

  let config = InterkitClient.config;
  let projectId = InterkitClient.projectId;
  let connectionIssue = InterkitClient.connectionIssue;

  import { Plugins } from '@capacitor/core';
  const { SplashScreen } = Plugins;

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
    {#if $projectId && initComplete}
      {#if isDesktop}
        <div class="fallback-wrap">
          <div class="fallback Fallback">
            <div class="fallback-text">
              <slot name="desktopfallback">
                <h1 class="fallback-text-headline Fallback__Text__Headline">{fallbackTitle}</h1>
                <p class="fallback-text-text Fallback__Text__Text">{fallbackText}</p>
              </slot>
            </div>
            <figure class="fallback-qr">
              <img class="fallback-qr-img" alt="QR" src={fallbackQrImageSrc} />
              <caption class="fallback-qr-caption">Scanne den QR-Code mit deinem Smartphone um die Webapp zu öffnen</caption>
            </figure>
            <nav class="fallback-buttons">
              <div>
                <Button
                    text="Ganzer Bildschirm"
                    on:click={() => { isDesktop = false }}
                    size="large"
                    type="secondary"
                    flex="normal"
                  >
                  <Icon type="position" />
                </Button>
                <div class="fallback-small">
                  Wenn Du ein Tablet verwendest, kannst Du hier in die Vollansicht wechseln
                </div>
              </div>
              <div>
                <slot name="fallbackButtons"></slot>
              </div>
            </nav>
            <div class="fallback-preview">
              <iframe class="fallback-preview-iframe Fallback__Preview__Iframe" src={fallbackIframeSrc}></iframe>
            </div>
          </div>
        </div>
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
  </Styling>
</div>

<style>
  .AppBase {
    height: 100%;
    pointer-events: all;
    touch-action: auto;
  }
  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: #FFFFFF;
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

    .AppBase {
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  
      box-sizing: border-box;
    }    

    .fallback-wrap {
      max-height: 100vh;
      overflow-y: scroll;
    }

    .fallback {
      display: grid;
      grid-template-columns: 2.5fr 2.5fr 1fr 360px;
      grid-template-rows: auto auto;
      grid-template-areas:
        "txt txt n ifr"
        "qr  btn n ifr";
      grid-gap: var(--distance-m);
      padding: var(--distance-xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    .fallback-text {
      grid-area: txt;
    }

    .fallback-qr {
      grid-area: qr;
      align-self: end;
    }

    .fallback-buttons {
      grid-area: btn;
      align-self: end;
    }

    .fallback-preview {
      grid-area: ifr;
    }

    .fallback-preview-iframe {
      width: 360px;
      height: 720px;
      border: 12px solid black;
      border-radius: 48px;
      overflow: hidden;
    }

  </style>
</svelte:head>
