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
  button.selected {
    font-weight: bold;
  }
</style>