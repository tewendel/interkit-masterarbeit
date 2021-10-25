<script>
  import { InterkitClient, util } from '../'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  // name of the trigger to activate on select
  export let selectTrigger

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("ElementList needs elementsContextProvider as parent");
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
    <ul>
      {#each $elements as element}
        <li class="item" on:click={()=>{onClick(element)}}>
          <slot name="contentElement" element={{...element.row, size: "l"}}></slot>
          <span class="right-arrow"><Button type="secondary"><Icon type="arrow-right"/></Button></span>
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