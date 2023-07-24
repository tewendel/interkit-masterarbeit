<script>

  import { onMount, getContext, onDestroy } from 'svelte'
  import { util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import AspectRatio from './AspectRatio.svelte';
  import ContextProvider from './ContextProvider.svelte'
  
  export let imageColumn;
  export let orderColumn;

  let elementsContext = getContext("elements");
  if(!elementsContext) console.warn("PictureBook needs DataLoaderSingle or DataRouteMulti as parent");
  let elements = elementsContext?.elements;
  
  let slides;
  let slideUnsubscribe;
  
  const initSlides = async ()=> {
      // setup the subscription to the tip rows
      const columnMap = {
        image: imageColumn,
        order: orderColumn
      }
      slideUnsubscribe = elements.subscribe(data => {
        console.log("data", data);
        slides = data.map(e=> util.rowToObject(e.row, columnMap))
      })
  }

  let slideIndex = 0;
  const incrIndex = () => {
    if(slideIndex < slides.length - 1) {
       slideIndex += 1;
    }
  }
  const decrIndex = () => {
    if(slideIndex > 0) {
       slideIndex -= 1;
    }
  }

  onMount(async ()=>{
    await initSlides();
  })
  onDestroy(()=>{
    if(slideUnsubscribe) slideUnsubscribe();
  })

  let carousel;
  
  const handleScroll = () => {
    if(!carousel) return;
    //console.log("carousel.clientWidth", carousel.clientWidth)
    let newIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    if(newIndex != slideIndex) slideIndex = newIndex; 
    setTimeout(()=>{
      //console.log("scroll " + carousel.scrollLeft / carousel.clientWidth)
      let newIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
      if(newIndex != slideIndex) slideIndex = newIndex; 
    }, 400);
  }

  let showVideoOverlay = false;
  let audioPlaybackControl = "stopped";

  $: {
    slideIndex; 
    audioPlaybackControl = "stopped";
  }

  const handleImageClick = () => {
    console.log("handleImageClick")
    if(slides[slideIndex].video?.value) {
      showVideoOverlay = true
    }
    if(slides[slideIndex].audio) {
      if(audioPlaybackControl != "playing") audioPlaybackControl = "playing";
    }
  }

  let innerWidth;
  $: {
    innerWidth;
    handleScroll();
  }
  
</script>

<svelte:window 
	bind:innerWidth
/>
  
{#if slides?.length}
  
  <div class="PictureBook image-slider-container" bind:this={carousel} on:scroll={handleScroll}>
    {#each slides as slide}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="PictureBook__Slide image-slide" on:click={handleImageClick}>
      {#if slide?.image}
        <AspectRatio aspectRatioType="element">
          <MediaFileImage fitDimension="both" mediafileRef={slide?.image}/>
        </AspectRatio>
      {/if}
    </div>
    {/each}
  </div>

  <div class="PictureBook__Pagination pagination-container">
    {#if slides.length > 1}
      <ul class="PictureBook__PaginationList pagination">
        {#each slides as slide, index}
          <li
            class="PictureBook__PaginationItem pagination-item"
            class:PictureBook__PaginationItem--active={index === slideIndex}
            class:pagination-item--active={index === slideIndex}
            ></li>
        {/each}
      </ul>
    {/if}
  </div>

  {#key slideIndex}
    <ContextProvider 
      name="element" 
      value={$elements[slideIndex].row}
    >
      <slot name="contentElement"></slot>
    </ContextProvider>
  {/key}

{/if}
  
<style>

  .image-slider-container {

    scroll-snap-type: x mandatory;	
		display: flex;
		-webkit-overflow-scrolling: touch;
		overflow-x: scroll;
    scrollbar-width: none;
  }

  .image-slide {
    min-width: 100vw;
		scroll-snap-align: start;
  }

  /* TODO this pagination setup is copied almost 1:1 from MultiStepContent,
   *   if MultiStepContent is needed, it should be a shared component */

  .pagination-container {
    margin-top: calc(var(--outset-y) * 0.5rem);
    margin-bottom: calc(var(--outset-y) * 0.5rem);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    z-index: 1;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .pagination-item {
    width: 0.375rem;
    height: 0.375rem;
    margin: 0 calc(var(--outset-x) * 0.1875rem);
    padding: 0;
    border: var(--border-width) solid var(--color-border-button-primary);
    border-radius: 50%;
  }

  .pagination-item--active {
    background-color: var(--color-pagination);
  }

  .video-close-button {
    position: fixed;
    z-index: 1000;
    pointer-events: all;
    top: calc(var(--outset-y) * 1rem);
    right: calc(var(--outset-x) * 1rem);
  }

</style>
