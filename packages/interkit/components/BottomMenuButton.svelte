<script>
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);

  export let label
</script>


<button class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
  {label}
</button>


<style>
  button {
    flex:1;
    height: 3em;
    font-family: var(--font-family);
    color: var(--color-primary);
  }

  button.selected {
    font-weight: bold;
  }
</style>

