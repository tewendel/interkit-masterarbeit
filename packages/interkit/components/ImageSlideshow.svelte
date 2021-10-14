<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';
  import ImageSlideshowSlide from './ImageSlideshowSlide.svelte';

  export let slideshowSheetKey
  export let superTitleColumn
  export let titleColumn
  export let imageColumn
  export let URLColumn

  let slides

  onMount(async () => {
    slides = await InterkitClient.getRowSubStore(slideshowSheetKey, {
      superTitleColumn,
      titleColumn,
      imageColumn,
      URLColumn
    })
  })

</script>

<div class="ImageSlideshow container">
  {#if $slides}
    <div class="ImageSlideshow__Slider slider" data-slides-amount={$slides.length}>
      {#if $slides.length}
        {#each $slides as slide}
          <div class="ImageSlideshow__Slide slide">
            <ImageSlideshowSlide
              superTitle={ slide.superTitleColumn }
              title={ slide.titleColumn }
              mediafileRef={ slide.imageColumn }
              url={ slide.URLColumn }
              autoVia={ true }
              />
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style> 

  .container {
    width: 100%;
  }

  .slider {
    display: flex;
    flex-flow: row nowrap;
    scroll-snap-type: x mandatory;
    width: 100%;
    overflow: auto;
    scrollbar-width: none;
  }

  .slider[data-slides-amount="1"] .slide {
    width:100%;
  }

  .slide {
    width: 85%;
    flex: none;
    scroll-snap-align: center;
    box-sizing: border-box;
    overflow: hidden; /* so border-radius works, TODO check iOS */
    border: var(--border-width) solid var(--border-color);
  }

  .slide:first-child {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .slide:last-child {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  .slide + .slide {
    border-left: none;
  }

</style>
