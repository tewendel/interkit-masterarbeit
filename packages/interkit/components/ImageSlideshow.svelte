<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';
  import Slider from './Slider.svelte';
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
    <Slider slides={$slides} let:slide>
      <ImageSlideshowSlide
        superTitle={ slide.superTitleColumn }
        title={ slide.titleColumn }
        mediafileRef={ slide.imageColumn }
        url={ slide.URLColumn }
        autoVia={ true }
        />
    </Slider>
  {/if}
</div>

<style> 

  .container {
    width: 100%;
  }

</style>
