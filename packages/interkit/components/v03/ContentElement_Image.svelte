<script>

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store'
  import { util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import ButtonBar from './ButtonBar.svelte'
  
  export let element; // alaways use prop
  export let objectFit;
  export let big = false; big = big == "TRUE" ? true : false;

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
      {#if big}
        <MediaFileImage useLink objectFit={objectFit} fitDimension="both" mediafileRef={imageRef} />    
      {:else}
        <AspectRatio>
          <MediaFileImage useLink objectFit={objectFit} fitDimension="both" mediafileRef={imageRef} />    
        </AspectRatio>
      {/if}
      
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
