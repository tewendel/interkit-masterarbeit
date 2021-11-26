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
  class="wrap"
  style={`
    --preview-width: ${iframeWidth}px;
    --preview-height: ${iframeHeight}px;
    `}
  >
  <div class="container">
    <div class="text">
      <slot name="content">
        <h1 class="text-headline DesktopFallback__Text__Headline">{title}</h1>
        <p class="text-text DesktopFallback__Text__Text">{text}</p>
      </slot>
    </div>
    <figure class="qr DesktopFallback__QR">
      <img class="qr-img" alt="QR" src={qrImageSrc} />
      <caption class="qr-caption">Scanne den QR-Code mit deinem Smartphone um die Webapp zu öffnen</caption>
    </figure>
    <nav class="buttons">
      <div class="buttons-fullscreen">
        <Button
          text="Ganzer Bildschirm"
          on:click={() => { isDesktop.set(false) }}
          size="large"
          type="secondary"
          flex="normal"
          >
          <Icon type="full-screen-full" />
        </Button>
        <div class="buttons-fullscreen-caption">
          Wenn Du ein Tablet verwendest, kannst Du hier in die Vollansicht wechseln
        </div>
      </div>
      <div>
        <slot name="buttons"></slot>
      </div>
    </nav>
    <div class="preview">
      <iframe class="preview-iframe DesktopFallback__Preview__Iframe" src={iframeSrc}></iframe>
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
  grid-gap: var(--distance-m);
  padding: var(--distance-xl);
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1000px) {
  .container {
    grid-template-areas:
      "txt txt n ifr"
      "qr  btn n ifr";
  }
}

.text {
  grid-area: txt;
  text-align: center;
  margin-bottom: var(--distance-xl);
}

.qr {
  grid-area: qr;
  align-self: end;
  text-align: center;
  margin-bottom: var(--distance-xl);
}
.qr-img {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--distance-m);
  max-width: 12em;
}

caption {
  width: 100%;
}

.buttons {
  grid-area: btn;
  align-self: end;
  margin-bottom: var(--distance-xl);
}

.buttons-fullscreen {
  text-align: center;
  margin-bottom: var(--distance-xl);
}

/* FIXME pbly not the smartest way to do this */
.buttons-fullscreen :global(.Button) {
  padding-left: var(--distance-m);
  padding-right: var(--distance-m);
}

.preview {
  grid-area: ifr;
}

.preview-iframe {
  width: var(--preview-width);
  height: var(--preview-height);
  border: 12px solid black;
  border-radius: 48px;
  overflow: hidden;
}

.qr-caption,
.buttons-fullscreen-caption {
  margin: var(--distance-s) 0;
}

</style>
