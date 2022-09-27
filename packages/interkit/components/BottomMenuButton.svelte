<script>
  import { setContext } from 'svelte';
  import { InterkitClient } from '../'
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  setContext('iconHeight', '20px');

  export let label
  export let key

  registerTab(tab, key);
  
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
    {#if $$slots.selectedIcon}
      <span class="icon icon-selected">
        <slot name="selectedIcon" />
      </span>
    {/if}
  {:else}
    <span class="icon">
      <slot name="defaultIcon"/>
    </span>
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
    background-color: var(--color-background);
    color: var(--color-text);
    outline: none;
    border-style: solid;
    border-width: var(--border-width) 0 0 0;
    border-color: var(--border-color);
  }

  .button .icon {
    border-style: solid;
    border-color: transparent;
    border-width: var(--border-width);
    border-radius: var(--border-radius-button);
    padding: var(--distance-xs) var(--distance-m);
  }

  .button .icon-selected {
    border-color: var(--color-border);
    background-color: var(--color-background-highlight);
  }

  /*.button:not(:first-child) {
    border-left-width: var(--border-width);
  }*/

  .button:active {
    filter: brightness(90%);
  }

  .button .text {
    font-size: var(--font-size-buttons);
    font: var(--font-caption);
  }

  /*
  .button.selected .text {
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: currentColor;
  }
  */

</style>

