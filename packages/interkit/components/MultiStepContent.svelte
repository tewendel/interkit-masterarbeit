<script>

  import { onMount } from "svelte"
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';
  import AspectRatio from './AspectRatio.svelte'
  import MarkdownContent from './MarkdownContent.svelte'
  import { getShowDummyDataStore } from './dummyDataHelpers.js'

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

  export let nextButtonText = "Weiter"
  export let backButtonText = "Zurück"
  export let skipButtonText = null
  export let finalButtonText = null

  const showDummyData = getShowDummyDataStore()
  if ($showDummyData) {
    slides = [
      { bgimage: true, fgimage: true, image: true, superTitle: 'superTitle 1', title: 'title 1', content: 'content 1' },
      { bgimage: true, fgimage: true, image: true, superTitle: 'superTitle 2', title: 'title 2', content: 'content 2' },
      { bgimage: true, fgimage: true, image: true, superTitle: 'superTitle 3', title: 'title 3', content: 'content 3' }
    ]
  }

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

  <div class="MultiStepContent container">
    
      {#if slides[slideIndex]?.image}
        <div class="MultiStepContent__Image image">
          <AspectRatio standalone>
            <MediaFileImage mediafileRef={slides[slideIndex].image}/>
          </AspectRatio>
        </div>
      {/if}
      
      {#key slideIndex}
        <div class="MultiStepContent__Content content">
          <span class="MultiStepContent__SuperTitle">{slides[slideIndex]?.supertitle || ""}</span>
          <h1 class="MultiStepContent__Title">{slides[slideIndex]?.title || ""}</h1>
          <MarkdownContent content={slides[slideIndex]?.content || ""}/>
        </div>
      {/key}

      <div class="MultiStepContent__ButtonBar Button__Bar button-bar">
        {#if slideIndex > 0 && backButtonText}<Button text={backButtonText} onClick={()=>{slideIndex -= 1}} flex="fill" />{/if}
        {#if slideIndex < slides.length - 1}
          <Button text={nextButtonText} on:click={incrIndex} flex="fill" type="primary" />
        {/if}
        {#if !finalButtonText && slideIndex == slides.length - 1 && onClose}
          <Button text={nextButtonText} on:click={incrIndex} flex="fill" type="primary" />
        {/if}
        {#if finalButtonText && slideIndex == slides.length - 1 && onClose} 
          <Button text={finalButtonText} on:click={onClose} flex="fill" type="primary" />
        {/if}
        {#if skipButtonText && slideIndex < slides.length - 1 && onClose} 
          <Button text={skipButtonText} on:click={onClose} flex="fill" type="secondary" />
        {/if}
      </div>
      
  </div>

  <ul class="pagination MultiStepContent__Pagination">
    {#each slides as slide, index}
      <li class="pagination-item MultiStepContent__PaginationItem" class:pagination-item--active={index === slideIndex}></li>
    {/each}
  </ul>

{/if}
  

<style>

  .MultiStepContent__Image__Container {
    position: relative;
    width: 100%;
    height: 12.5rem;
  }

  :global(.MultiStepContent__Image__Container img) {
    position: absolute;
    top: 0;
    left: 0;
  }

  .container {
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-background);
    z-index: 1;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
  }

  .container .image {
    width: 100%;
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  .container .content {
    max-height: 32vh;
    overflow-y: auto;
    padding-bottom: calc(var(--outset-y) * 0.25rem);
  }

  .pagination {
    z-index: 1;
    list-style-type: none;
    margin:
      calc(var(--outset-y) * 0.5rem)
      auto;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  :global(.TutorialSlideshow) .pagination {
    margin-top: calc(var(--outset-y) * 2rem);
    margin-bottom: calc(var(--outset-y) * 2rem);
  }

  .pagination-item {
    width: 0.375rem;
    height: 0.375rem;
    margin: 0 calc(var(--outset-x) * 0.375rem);
    padding: 0;
    border: var(--border-width) solid var(--color-border-button-primary);
    border-radius: 50%;
  }

  .pagination-item--active {
    background-color: var(--color-pagination);
  }

  h1, p {
    text-align: center;
  }

  h1 {
    font: var(--font-headline-1);
    letter-spacing: var(--letter-spacing-headline-1);
    margin-bottom: calc(var(--outset-y) * 2rem);
  }

  p {
    font: var(--font-regular);
    letter-spacing: var(--letter-spacing-regular);
    line-height: var(--line-height-regular);
    margin-bottom: calc(var(--outset-y) * 2rem);
    padding-left: calc(var(--outset-x) * 0.5rem);
    padding-right: calc(var(--outset-x) * 0.5rem);
  }

  .button-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: calc(var(--outset-y) * 0.5rem);
    gap: calc(var(--outset-x) * 0.5rem);
  }

  :global(.QRTips__Button__Bar span:not(:first-child)) {
    margin-left: calc(var(--outset-x) * 0.5rem);
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
