<script>
  import { InterkitClient, util } from '..'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import ContextProvider from './ContextProvider.svelte'

  let elementsContext = getContext("elements");
  if(!elementsContext) console.warn("ElementList needs DataLoaderSingle or DataRouteMulti as parent");
  let elements = elementsContext?.elements;

  /*$: {
    console.log("DataList got data update", $elements)
  }*/

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [...Array(10).keys()].map((k) => {return {key: `${k}`, row: {key: `${k}`, values: {}}}})

</script>

  {#if $elements?.length || $showDummyData}
    <ul class="DataList">
      {#each ($showDummyData ? dummyData : $elements) as element}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li class="DataList__Item item">
          <ContextProvider 
            name="element" 
            value={element.row}
          >
            <slot name="dataElement"></slot>
          </ContextProvider>
        </li>
      {/each}
    </ul>
  {:else}
    <slot name="emptyElement"></slot>
  {/if}

<style>
  
  li.item {
    position: relative;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: calc(var(--outset-y) * 0.5rem);
  }

</style>
