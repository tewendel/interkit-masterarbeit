<script>

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store'
  
  import { util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import ButtonBar from './ButtonBar.svelte'
  
  export let element; // must be used with a prop (ElementList oder ElementProvider)
  console.log("contentElement_List with prop", element);
  if(!element) {
    alert("this needs an element prop, for example from ElementList or ElementProvider")
  }
  
  export let titleColumn
  export let subtitleColumn
  export let imageColumn
  
  $: title = util.rowVal(element, titleColumn)
  $: subtitle = util.rowVal(element, subtitleColumn)
  $: imageRef = util.rowVal(element, imageColumn)

  export let subtitleTag // special Tag to show before subtitle

  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(element)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(element)

  
</script>

{#if element}

  <section class={`ContentElement container`}>
      
    <figure class="ContentElement__Picture ContentElementAudio__Picture picture">
      <AspectRatio aspectRatioType="square">
        <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
      </AspectRatio>
    </figure>

    <div class="content">

      {#key title}
      <h3 class="title">
        {title}
      </h3>
      {/key}

      <h4>
        {#if subtitleTag}
          <span class="subtitleTag">{subtitleTag}</span>
        {/if}
        
        {#if subtitle}
          <span class="subtitle">{subtitle}</span>
        {/if}
      </h4>

      <div class="special">
        <slot name="special"></slot>
      </div>
      
    </div>

    <ButtonBar>    
      <slot name="buttons"></slot>
    </ButtonBar>

  </section>

{/if}

<style>
  .container {
  }
  .content {
    padding: var(--distance-m) var(--distance-xl) var(--distance-s) var(--distance-m);

  }
  .picture {
    margin: var(--distance-s) var(--distance-m) var(--distance-s) var(--distance-s);
    border-radius: var(--border-radius-button);
    overflow: hidden;
    width: 96px;
    height: 96px;
    float: left;
  }
  .title {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
    padding-bottom: var(--distance-tiny);
  }
  .subtitleTag {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
    filter: brightness(2.75);
    padding-right: var(--distance-s);
  }
  .subtitle {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
  }
  .special {
    margin-top: var(--distance-s);
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
  }

</style>
