<script>

  import { onMount } from "svelte"
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';
  import AspectRatio from './AspectRatio.svelte'
  import MarkdownContent from './MarkdownContent.svelte'

  export let slides;
  /* array of objects with
  - bgimage (mediafileRef)
  - fgimage (mediafileRef)
  - image (mediafileRef)
  - superTitle
  - title
  - content
  */

  export let onClose;
  
  let slideIndex = 0;

  const incrIndex = () => {
    if(slideIndex < slides.length - 1) {
       slideIndex += 1;
    } else {
      if(onClose) onClose();
    }
  }

</script>

{#if slides?.length}

  <div class="MultiStepContent__Image__Container">

    {#if slides[slideIndex]?.bgimage}
      <MediaFileImage mediafileRef={slides[slideIndex].bgimage}/>
    {/if}

    {#if slides[slideIndex]?.fgimage}
      <MediaFileImage mediafileRef={slides[slideIndex].fgimage}/>
    {/if}

  </div>

  <div class="container">
    
      {#if slides[slideIndex]?.image}
        <div class="image">
          <AspectRatio standalone>
            <MediaFileImage mediafileRef={slides[slideIndex].image}/>
          </AspectRatio>
        </div>
      {/if}
      
      {#key slideIndex}
        <div class="content">
          <span>{slides[slideIndex]?.supertitle || ""}</span>
          <h1>{slides[slideIndex]?.title || ""}</h1>
          <MarkdownContent content={slides[slideIndex]?.content || ""}/>
        </div>
      {/key}

      <div class="Button__Bar button-bar">
        {#if slideIndex > 0}<Button text="Zurück" onClick={()=>{slideIndex -= 1}} flex="fill" />{/if}
        {#if slideIndex < slides.length - 1 || onClose}
          <Button text="Weiter" onClick={incrIndex} flex="fill" type="primary" />
        {/if}
      </div>
      
  </div>

  <ul class="pagination">
    {#each slides as slide, index}
      <li class="pagination-item" class:pagination-item--active={index === slideIndex}></li>
    {/each}
  </ul>

{/if}
  

<style>

  .MultiStepContent__Image__Container {
    position: relative;
    width: 100%;
    height: 200px;
  }

  :global(.MultiStepContent__Image__Container img) {
    position: absolute;
    top: 0;
    left: 0;
  }

  .container {
    margin-left: 16px;
    margin-right: 16px;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    z-index: 1;
    pointer-events: all;
    display: flex;
    flex-direction: column;
  }

  .container .image {
    width: 100%;
    margin-bottom: 16px;
  }

  .container .content {
    max-height: 30vh;
    overflow-y: auto;
  }

  .pagination {
    z-index: 1;
    list-style-type: none;
    margin: var(--distance-s) auto;
    padding: 0;
    display: flex;
  }

  :global(.TutorialSlideshow) .pagination {
    margin-top: var(--distance-l);
    margin-bottom: var(--distance-l);
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

  h1, p {
    text-align: center;
  }

  h1 {
    font-size: var(--font-size-headline-1);
    margin-bottom: 16px;
  }

  p {
    font-size: var(--font-size-regular);
    line-height: var(--line-height-regular);
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .button-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: var(--distance-m);
    gap: var(--distance-s);
  }

  :global(.QRTips__Button__Bar span:not(:first-child)) {
    margin-left: 8px;
  }

  :global(.TutorialSlideshow) .MultiStepContent__Image__Container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
  }

  :global(.TutorialSlideshow) .container {
    margin-top: auto;
  }

</style>
