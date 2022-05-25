<script>

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store'
  import { util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import ButtonBar from './ButtonBar.svelte'
  
  export let element; // alaways use prop
  
  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(element)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(element)

  export let imageColumn
  $: imageRef = util.rowVal(element, imageColumn)
  
</script>

{#if element}

  <section>

    <figure>
      <AspectRatio>
        <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
      </AspectRatio>
    </figure>
      
    <ButtonBar right>    
      <slot class="xyz" name="buttons"></slot>
    </ButtonBar>

  </section>

{/if}

<style>
  figure {
    padding-bottom: var(--distance-s);
  }
</style>
