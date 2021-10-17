<script>

  import { onMount } from "svelte"
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';

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
          <MediaFileImage mediafileRef={slides[slideIndex].image}/>
        </div>
      {/if}
      
      <span>{slides[slideIndex]?.supertitle || ""}</span>
      <h1>{slides[slideIndex]?.title || ""}</h1>
      <p>{slides[slideIndex]?.content || ""}</p>

      <div class="QRTips__Button__Bar button-bar">
        {#if slideIndex > 0}<Button text="Zurück" onClick={()=>{slideIndex -= 1}}/>{/if}
        {#if slideIndex < slides.length - 1 || onClose}
          <Button text="Weiter" onClick={incrIndex}/>
        {/if}
      </div>
      
  </div>

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
    border: 1px solid black;
    border-radius: var(--border-radius);
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    z-index: 1;
    pointer-events: all;
  }

  .container .image {
    border: 1px solid black;
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    margin-bottom: 16px;
    max-height: 200px;
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
    width: 80%;
  }

  .button-bar {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
  }

  :global(.QRTips__Button__Bar span:not(:first-child)) {
    margin-left: 8px;
  }


</style>
