<script>
  import { InterkitClient, util } from '..'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import ContextProvider from './ContextProvider.svelte'

  // name of the trigger to activate on select
  export let selectTrigger
  export let showArrow = false; showArrow = showArrow == "TRUE" ? true : false;
  
  /*
    @example
    <Button>
      Text
    </Button>
  */

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("ElementList needs elementsContextProvider as parent");
  let elements = elementsContext?.elements;

  const onClick = (element) => {
    // trigger the action, if set
    if(selectTrigger) {
      console.log("DataList onClick", element, selectTrigger)
      executeTrigger(selectTrigger, element.row)
    }
  }

</script>

{#if $elements}
  {#if $elements.length == 0}
    <slot name="emptyElement"></slot>
  {:else}
    <ul>
      {#each $elements as element}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li class="item" on:click={()=>{onClick(element)}}>
          <ContextProvider 
            name="element" 
            value={element.row}
          >
            <slot name="dataElement"></slot>
          </ContextProvider>
          {#if showArrow}
            <span class="right-arrow"><Button type="link"><Icon type="arrow-right"/></Button></span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

{/if}


<style>
  .back {
    padding: 10px;
  }
  .back:hover {
    cursor: pointer;
  }

  li.item {
    position: relative;
  }
  .right-arrow {
    position:  absolute;
    bottom: var(--distance-m);
    right: var(--distance-m);
  }

</style>