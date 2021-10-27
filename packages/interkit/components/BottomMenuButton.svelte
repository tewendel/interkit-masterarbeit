<script>
  import { InterkitClient } from '../'
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);

  export let label
  export let key

  const bottomMenuKey = InterkitClient.getUiKeyStore("bottomMenuKey");
  $: {
    if(bottomMenuKey) {
      //console.log($bottomMenuKey)
      if(key == $bottomMenuKey) {
        selectTab(tab)
      }
    }
  }

  const selectTabStore = (tab) => {
    InterkitClient.setUiKey("bottomMenuKey", key);    
  }
  
  
</script>


<button 
    class="BottomMenuButton button"
    class:selected="{$selectedTab === tab}"  
    on:click="{() => selectTabStore(tab)}"
  >
  {#if $selectedTab === tab}
    <slot name="selectedIcon"/>
  {:else}
    <slot name="defaultIcon"/>
  {/if}
  <span class="BottomMenuButton__Text text">
    {label}
  </span>  
</button>


<style>
  .button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /*height: 3em;*/
    font-family: var(--font-family);
    background-color: var(--color-background-highlight);
    color: var(--color-text);
    outline: none;
    border-style: solid;
    border-width: var(--border-width) 0 0 0;
    border-color: var(--border-color);
  }

  .button:not(:first-child) {
    border-left-width: var(--border-width);
  }

  .button:active {
    filter: brightness(90%);
  }

  .button .text {
    font-size: var(--font-size-buttons);
  }

  /*
  .button.selected .text {
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: currentColor;
  }
  */

</style>

