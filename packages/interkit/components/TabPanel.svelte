<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';
  import { InterkitClient } from '../'

  export let path;

	const panel = {};
	const { registerPanel, selectedPanel, selectPanel } = getContext(TABS);

  // register a method into the global namespace to switch to this tab
  if(path) {
    InterkitClient.registerGlobalMethod(path, () => {
      selectPanel(panel)
    });
  }
	registerPanel(panel);
</script>

{#if $selectedPanel === panel}
	<div class="tab-panel-container"><slot></slot></div>
{/if}

<style>

  .tab-panel-container {
    padding-bottom: 50px;
    height: 100%;
  }

</style>