<script>

  import { setContext, getContext } from 'svelte';

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let title;
  export let text;
  export let qrImageSrc;

  const iframeSrc = `//${document.location.host}${document.location.pathname}${document.location.search?document.location.search:'?'}&desktop=1${document.location.hash}`

  const iframeWidth = 340;
  const iframeHeight = 720;

  const isDesktop = getContext('isDesktop');

</script>

<div
  class="wrap DesktopFallback"
  style={`
    --preview-width: ${iframeWidth}px;
    --preview-height: ${iframeHeight}px;
    `}
  >
  <div class="container">
    <div class="text">
      <slot name="content">
        <h1 class="text-headline DesktopFallback__TextHeadline">{title}</h1>
        <p class="text-text DesktopFallback__Text">{text}</p>
      </slot>
    </div>
    <figure class="qr DesktopFallback__QR">
      <img class="qr-img" alt="QR" src={qrImageSrc} />
      <caption class="qr-caption">Scanne den QR-Code mit deinem Smartphone um die Webapp zu öffnen</caption>
    </figure>
    <nav class="buttons DesktopFallback__Buttons">
      <div class="buttons-fullscreen DesktopFallback__ButtonsFullscreen">
        <Button
          text="Ganzer Bildschirm"
          on:click={() => { isDesktop.set(false) }}
          size="large"
          type="secondary"
          flex="normal"
          >
          <Icon type="full-screen-full" />
        </Button>
        <div class="buttons-fullscreen-caption DesktopFallback__ButtonsFullscreenCaption">
          Wenn Du ein Tablet verwendest, kannst Du hier in die Vollansicht wechseln
        </div>
      </div>
      {#if $$slots.buttons}
        <div class="buttons-slot DesktopFallback__Buttons">
          <slot name="buttons"></slot>
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

/* FIXME pbly not the smartest way to do this */
.buttons-fullscreen :global(.Button) {
  padding-left: var(--distance-m);
  padding-right: var(--distance-m);
  margin-bottom: var(--distance-m);
}

.buttons-slot {
  margin-top: calc(var(--outset-y) * 3rem);
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

.qr-caption,
.buttons-fullscreen-caption {
  margin:
    calc(var(--outset-y) * 0.5rem)
    0;
}

</style>
