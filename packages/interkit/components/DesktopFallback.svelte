<script>

  import { setContext, getContext } from 'svelte'

  import { t, translations } from '../i18n.js'

  import {
    getShowDummyDataStore,
    dummyLorem1Paragraph,
    dummyQrSrc
  } from './dummyDataHelpers.js'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let title
  export let text
  export let qrImageSrc
  export let iframeWidth = '340px'
  export let iframeHeight = '720px'
  /* default values *must* come from the yaml, store-nature of lang creates really tricky race condition */
  export let fullscreenButtonText // = '$desktopfallback_fullscreen' // won't work!
  export let fullscreenHint // = null ... and checking "later" won't work either!
  export let qrHint

  let showDummyData = getShowDummyDataStore()

  const iframeSrc = `//${document.location.host}${document.location.pathname}${document.location.search?document.location.search:'?'}&desktop=1${document.location.hash}`

  const isDesktop = getContext('isDesktop')

</script>

<div
  class="wrap DesktopFallback"
  style={`
    --preview-width: ${iframeWidth};
    --preview-height: ${iframeHeight};
  `}
  >
  <div class="container">
    <div class="text">
      {#if $$slots.content && $showDummyData}
        dummy content (slot)
      {/if}
      <slot name="content">
        <h1 class="text-headline DesktopFallback__TextHeadline">{$showDummyData ? 'dummy title' : title}</h1>
        <p class="text-text DesktopFallback__Text">{$showDummyData ? dummyLorem1Paragraph : text}</p>
      </slot>
    </div>
    <figure class="qr DesktopFallback__QR">
      <img class="qr-img" alt="QR" src={$showDummyData ? dummyQrSrc : qrImageSrc} />
      <caption class="qr-caption">
        {#if $showDummyData}dummy qrHint{/if}
        {qrHint}
      </caption>
    </figure>
    <nav class="buttons DesktopFallback__Buttons">
      <div class="buttons-fullscreen DesktopFallback__ButtonsFullscreen">
        <Button
          dummyNoText={true}
          text={($showDummyData ? 'fullscreenButtonText ' : '') + fullscreenButtonText}
          on:click={() => { isDesktop.set(false) }}
          size="large"
          type="secondary"
          flex="normal"
          >
          <Icon type="Full-FullScreen" />
        </Button>
        <div class="buttons-fullscreen-caption DesktopFallback__ButtonsFullscreenCaption">
          {#if $showDummyData}Dummy fullscreenHint{/if}
          {fullscreenHint}
        </div>
      </div>
      {#if $$slots.buttons || $showDummyData}
        <div class="buttons-slot DesktopFallback__Buttons">
          <slot name="buttons"></slot>
          {#if $showDummyData}
            <Button text="dummy Button small" size="small" />
          {/if}
        </div>
      {/if}
    </nav>
    <div class="preview DesktopFallback__Preview">
      <iframe class="preview-iframe DesktopFallback__PreviewIframe" src={iframeSrc}></iframe>
    </div>
  </div>
</div>

<style>

.wrap {
  max-height: 100vh;
  overflow-y: scroll;
}

.container {
  display: grid;
  grid-template-columns: 2.5fr 2.5fr 1fr var(--preview-width);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "txt txt txt txt"
    "qr  qr  n   ifr"
    "btn btn n   ifr";
  grid-gap:
    calc(var(--outset-y) * 1rem)
    calc(var(--outset-x) * 1rem);
  padding:
    calc(var(--outset-y) * 3rem)
    calc(var(--outset-x) * 3rem);
  max-width: 75rem;
  margin: 0 auto;
}

@media (min-width: 62.5rem) {
  .container {
    grid-template-areas:
      "txt txt n ifr"
      "qr  btn n ifr";
  }
}

.text {
  grid-area: txt;
  text-align: center;
  margin-bottom: calc(var(--outset-y) * 3rem);
}

.text-headline {
  font: var(--font-content-headline-1);
  letter-spacing: var(--letter-spacing-content-headline-1);
  margin-bottom: calc(var(--outset-y) * 1rem);
}

.text-text {
  font: var(--font-content-body-1);
  letter-spacing: var(--letter-spacing-content-body-1);
}

.qr {
  grid-area: qr;
  align-self: end;
  text-align: center;
  margin-bottom: calc(var(--outset-y) * 3rem);
}
.qr-img {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: calc(var(--outset-y) * 1rem);
  max-width: 12rem;
}

caption {
  display: block;
  width: 100%;
}

.buttons {
  grid-area: btn;
  margin-bottom: calc(var(--outset-y) * 3rem);
}

@media (min-width: 1000px) {
  .buttons {
    align-self: end;
  }
}

.buttons-fullscreen {
  text-align: center;
}

.buttons-slot {
  margin:
    calc(var(--outset-y) * 3rem)
    0
    calc(var(--outset-y) * 1rem)
    0;
}

.preview {
  grid-area: ifr;
}

.preview-iframe {
  width: var(--preview-width);
  height: var(--preview-height);
  border: 0.75rem solid black;
  border-radius: 3rem;
  overflow: hidden;
}

.qr-caption {
  font: var(--font-caption);
  letter-spacing: var(--letter-spacing-caption);
  margin:
    calc(var(--outset-y) * 1rem)
    0;
}

.buttons-fullscreen-caption {
  font: var(--font-caption);
  letter-spacing: var(--letter-spacing-caption);
  margin:
    calc(var(--outset-y) * 1rem)
    0
    calc(var(--outset-y) * 1rem)
    0;
}

</style>
