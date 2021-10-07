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

  let rowStore

  onMount(async () => {
    rowStore = await InterkitClient.getRowSubStore(slideshowSheetKey)
  })

</script>

<div class="ImageSlideshow container">
  {#if $rowStore}
    <div class="ImageSlideshow__Slider slider" data-slides-amount={$rowStore.length}>
      {#if $rowStore.length}
        {#each $rowStore as row}
          <div class="ImageSlideshow__Slide slide">
            <ImageSlideshowSlide
              superTitle={ util.rowVal(row, superTitleColumn) }
              title={ util.rowVal(row, titleColumn) }
              mediafileRef={ util.rowVal(row, imageColumn) }
              url={ util.rowVal(row, URLColumn) }
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
  }

  .slider[data-slides-amount="1"] .slide {
    width:100%;
  }

  .slide {
    width: 85%;
    flex: none;
    scroll-snap-align: center;
    box-sizing: border-box;
  }

  .slide + .slide {
    border-left: none;
  }

</style>
