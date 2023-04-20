<script>
  import { InterkitClient, util } from '../'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  import MediaFileImage from './MediaFileImage.svelte';
  import AspectRatio from './AspectRatio.svelte';

  // name of the trigger to activate on select
  export let selectTrigger

  export let imageColumn;
  export let secondaryImageColumn;
  export let secondaryProperty;

  let elementProperties = InterkitClient.getGlobalStore("elementProperties");

  export let slider = false // add border
  if (typeof slider == "string") slider = slider === "TRUE" // blockly conversion

  /*
    @example
    <Button>
      Text
    </Button>
  */

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("MediaMosaic needs elementsContextProvider as parent");
  let elements = elementsContext?.elements;

  const onClick = (element) => {

    console.log("onClick", element)
    
    // also trigger the action, if set
    if(selectTrigger)
      executeTrigger(selectTrigger, element.row)
  }

</script>

{#if $elements}
  {#if $elements.length == 0}
    <slot name="emptyElement"></slot>
  {:else}
    <div class="grid-wrapper" class:slider>
      {#each $elements as element}
        <div class="grid-item" on:click={()=>{onClick(element)}}>
          <AspectRatio aspectRatio={0.74}>
            {#if secondaryProperty && $elementProperties?.[element?.key]?.[secondaryProperty]}  
              <MediaFileImage fitDimension="both" objectFit="cover" mediafileRef={ util.rowVal(element.row, secondaryImageColumn) } /> 
            {:else}
              <MediaFileImage fitDimension="both" objectFit="cover" mediafileRef={ util.rowVal(element.row, imageColumn) } /> 
            {/if}
          </AspectRatio>
        </div>
      {/each}
      </div>
  {/if}

{/if}


<style>

  .grid-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .grid-wrapper.slider {
    display: flex;
    flex-flow: row nowrap;
    overflow: auto;
    scrollbar-width: none;
    width: 100%;
    border-radius: var(--border-radius);
    border: var(--border-width) solid var(--border-color);
  }

  .grid-wrapper.slider .grid-item {
    width: 33%;
    flex-shrink: 0;
  }
  
</style>