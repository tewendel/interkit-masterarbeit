<script>

  import { onMount, getContext, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import MarkdownContent from './MarkdownContent.svelte';
  import AspectRatio from './AspectRatio.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import InlineAudioPlayerButton from './InlineAudioPlayerButton.svelte';
  import Overlay from './Overlay.svelte';
  import TopNavBarCustom from './TopNavBarCustom.svelte';
  import InlineVideoPlayer from './InlineVideoPlayer.svelte';
  
  export let imageColumn;
  export let audioColumn;
  export let videoColumn;
  export let titleColumn;
  export let contentColumn;
  export let orderColumn;

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("ImageSlildeshow needs elementsContextProvider as parent");
  let elementsStore = elementsContext?.elements;
  
  let slides;
  let slideUnsubscribe;
  
  const initSlides = async ()=> {
      // setup the subscription to the tip rows
      const columnMap = {
        image: imageColumn,
        audio: audioColumn,
        video: videoColumn,
        title: titleColumn,
        content: contentColumn,
        order: orderColumn
      }
      slideUnsubscribe = elementsStore.subscribe(data => {
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
  let carouselWidth;

  const handleScroll = () => {
    let newIndex = Math.floor(carousel.scrollLeft / carouselWidth);
    if(newIndex != slideIndex) slideIndex = newIndex; 
    setTimeout(()=>{
      //console.log("scroll " + carousel.scrollLeft / carouselWidth)
      let newIndex = Math.floor(carousel.scrollLeft / carouselWidth);
      if(newIndex != slideIndex) slideIndex = newIndex; 
    }, 200);
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
  
</script>
  
{#if slides?.length}
  
  <div class="image-slider-container" bind:clientWidth={carouselWidth} bind:this={carousel} on:scroll={handleScroll}>
    {#each slides as slide}
    <div class="image-slide" on:click={handleImageClick}>
      {#if slide?.image}
        <AspectRatio aspectRatioType="element">
          <MediaFileImage fitDimension="both" mediafileRef={slide?.image}/>
        </AspectRatio>
      {/if}
    </div>
    {/each}
  </div>

  {#key slideIndex}
    {#if slides[slideIndex]?.title || slides[slideIndex]?.content}
      <div class="slide-content">
        <h1 class="title">{slides[slideIndex]?.title || ""}</h1>
        <div class="markdown-container">
          <MarkdownContent content={slides[slideIndex]?.content || ""}/>
        </div>
      </div>
    {/if}
  {/key}

  <div class="extras">

    <div class="left">
      {#key slideIndex}
        {#if slides[slideIndex].audio}
          <InlineAudioPlayerButton
            audioKeyDirect={slides[slideIndex].audio?.value}
            hideBackButton
            bind:playbackControl={audioPlaybackControl}
          />
        {/if}
      {/key}
      
      {#if slides[slideIndex]?.video?.value}
        <Button size="medium" type="primary" onClick={()=>{showVideoOverlay = true}}>
          <Icon type="Full-Play" inverse></Icon>
            Play Video
        </Button>
      {/if}

    </div>

    <div class="right">
      {#if slides.length > 1}
        <ul class="pagination">
          {#each slides as slide, index}
            <li class="pagination-item" class:pagination-item--active={index === slideIndex}></li>
          {/each}
        </ul>
      {/if}
    </div>

  </div>

  {#if showVideoOverlay}
    <Overlay customStyle="background-color: black;">
      <div class="video-close-button" on:click={()=>{showVideoOverlay=false}}>
        <Button>
          <Icon type="close"/>
        </Button>
      </div>
      <InlineVideoPlayer autoplay mediafileKey={slides[slideIndex]?.video?.value}/>
    </Overlay>
  {/if}
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

  .slide-content {
    padding: var(--distance-m);
    padding-bottom: 0px;
  }

  .title {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
    margin-bottom: var(--distance-s);
  }

  .markdown-container { 
    max-height: 50px;
  }

  .extras {
    display: flex;
    flex-direction: row;
    padding: var(--distance-m);
    
  }

  .extras .left, .extras .right {
    width: 50%;  
  }

  .extras .left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .extras .right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .pagination {
    z-index: 1;
    list-style-type: none;
    padding: 0;
    display: flex;
  }

  .pagination-item {
    /* TODO find better measurements */
    width: calc(1.5 * var(--distance-xs));
    height: calc(1.5 * var(--distance-xs));
    margin: 0 calc(0.5 * var(--distance-xs));
    padding: 0;
    border: var(--border-width) solid var(--border-color);
    border-radius: 50%;
  }

  .pagination-item--active {
    background-color: var(--border-color);
  }

  .video-close-button {
    position: fixed;
    z-index: 1000;
    pointer-events: all;
    top: var(--distance-m);
    right: var(--distance-m);
  }

</style>