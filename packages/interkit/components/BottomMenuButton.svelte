<script>
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);

  export let label
</script>


<button 
    class="BottomMenuButton button"
    class:selected="{$selectedTab === tab}"  
    on:click="{() => selectTab(tab)}"
  >
  <slot />
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

