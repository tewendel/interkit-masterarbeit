<script>
  import { getContext } from 'svelte'
  import ContextProvider from './ContextProvider.svelte';
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  

  export let gap = true;
  
  let elementsContext = getContext("elements");
  if(!elementsContext) console.warn("MediaMosaic needs elementsContextProvider as parent");
  let elements = elementsContext?.elements;

  $: console.log("Mosaic got data", $elements)

  let showDummyData = getShowDummyDataStore();
  const dummyData = [...Array(10).keys()].map((k) => {return {key: `${k}`, row: {key: `${k}`, values: {}}}})

</script>

{#if $elements || $showDummyData}
  {#if $elements?.length == 0 && $showDummyData}
    <slot name="emptyElement"></slot>
  {:else}
    <div class="Mosaic {gap ? 'Mosaic--gap' : ''} square-container" class:gap>
      {#each ($showDummyData ? dummyData : $elements) as element}
        <div class="Mosaic__Square square">
          <div class="Mosaic__Content content">
            <ContextProvider 
              name="element" 
              value={element.row}
            >
              <slot name="contentElement"></slot>
            </ContextProvider>
          </div>
        </div>
      {/each}
      </div>
  {/if}

{/if}


<style>

.square-container {
  display: flex;
  flex-wrap: wrap;
}

.square {
  position: relative;
  flex-basis: calc(33.33333%);
  box-sizing: border-box;
}

.square-container.gap {
  gap: 8px;
}

.square-container.gap .square {
  flex-basis: calc(33.33333% - (8px * 0.666));
}

.square::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.square .content {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 100%;
}
  
</style>
