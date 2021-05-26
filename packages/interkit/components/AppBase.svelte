<script>

  import { InterkitClient } from '../'
  import { onMount } from 'svelte'

  let initComplete = false;
  
  onMount(async ()=>{
    initComplete = await InterkitClient.initApp()  
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

  
</script>

<div class="AppBase Theming" id="Theming">
  {#if $projectId && initComplete}
    <slot ></slot>
  {:else}
    <div class="Loading">
      <p class="static-loading-indicator">laden....</p>
      {#if $connectionIssue}
      <button class="network-reload" on:click={retry}>verbinden</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .AppBase {
    height: 100%;
  }
  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: #FFFFFF;
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
    

    

  </style>
</svelte:head>