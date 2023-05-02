<script>
  import { InterkitClient, util } from '..'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import ContextProvider from './ContextProvider.svelte'

  let elementsContext = getContext("elements");
  if(!elementsContext) alert("ElementList needs DataLoader or DataRouteMulti as parent");
  let elements = elementsContext?.elements;

  /*$: {
    console.log("DataList got data update", $elements)
  }*/

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [...Array(10).keys()].map((k) => {return {key: `${k}`, row: {key: `${k}`, values: {}}}})

</script>

{#if $elements || $showDummyData}
  {#if $elements.length == 0 && !$showDummyData}
    <slot name="emptyElement"></slot>
  {:else}
    <ul>
      {#each ($showDummyData ? dummyData : $elements) as element}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li class="item">
          <ContextProvider 
            name="element" 
            value={element.row}
          >
            <slot name="dataElement"></slot>
          </ContextProvider>
        </li>
      {/each}
    </ul>
  {/if}
{/if}


<style>
  
  li.item {
    position: relative;
  }

</style>