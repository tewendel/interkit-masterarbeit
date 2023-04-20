<script>

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';
  import Icon from './Icon.svelte';
  import AspectRatio from './AspectRatio.svelte'

  export let mediafileRef
  export let url
  export let superTitle
  export let title
  export let autoVia

  // get the second level domain, e.g. "instagram"
  $: via = url?.match(/^(?:https?:)?.*\b([\w\-]+)\.\w+/)?.[1]

</script>

<div class="ImageSlideshowSlide container">
  <AspectRatio aspectRatioType="square">
  <MediaFileImage fitDimension="both" objectFit="cover" mediafileRef={ mediafileRef } />
  <div class="ImageSlideshowSlide__titles titles">
    {#if autoVia && via && !superTitle}
      <div class="ImageSlideshowSlide__title-super title-super">via { via }</div>
    {:else}
      <div class="ImageSlideshowSlide__title-super title-super">{ superTitle }</div>
    {/if}
    <div class="ImageSlideshowSlide__title title">{ title }</div>
  </div>
  <a href={ url } target={ "interkit-social" } class="ImageSlideshowSlide__button button">
    <Button>
      <Icon type="arrow-right"/>
    </Button>
  </a>
  </AspectRatio>
</div>

<style>

  .container {
    position: relative;
    height: 100%;
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

  .title {
    font-size: 200%;
    font-weight: bold;
  }

  .title-super {
    text-transform: uppercase;
  }

  .button {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }

</style>
