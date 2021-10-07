<script>

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';

  export let mediafileRef
  export let url
  export let superTitle
  export let title
  export let autoVia

  // get the second level domain, e.g. "instagram"
  $: via = url?.match(/^(?:https?:)?.*\b([\w\-]+)\.\w+/)?.[1]

</script>

<div class="ImageSlideshowSlide container">
  <MediaFileImage mediafileRef={ mediafileRef } />
  <div class="ImageSlideshowSlide__titles titles">
    {#if autoVia && via}
      <div class="ImageSlideshowSlide__title-sub title-sub">via { via }</div>
    {:else}
      <div class="ImageSlideshowSlide__title-sub title-sub">{ title }</div>
    {/if}
    <div class="ImageSlideshowSlide__title-super title-super">{ superTitle }</div>
  </div>
  <a href={ url } class="ImageSlideshowSlide__button button">
    <Button>
      <!-- FIXME use proper icon -->
      &gt;
    </Button>
  </a>
</div>

<style>

  .container {
    position: relative;
  }

  .titles {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: calc(100% - 4rem);
    max-height: clac(100% - 2rem);
    overflow: hidden;
    word-break: break-word;
  }

  .title-super {
    font-size: 200%;
    font-weight: bold;
  }

  .title-sub {
    text-transform: uppercase;
  }

  .button {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }

</style>
