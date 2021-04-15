<script>
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';
  import { InterkitClient } from '../'

  export let path;

  const panel = {};
  const { registerPanel, selectedPanel, selectPanel } = getContext(TABS);

  registerPanel(panel);

  // register a method into the global namespace to switch to this tab
  if(path) {
    InterkitClient.registerGlobalMethod(path, () => {
      selectPanel(panel)
    });
  }

</script>


<div class="page" class:visible="{$selectedPanel === panel}">
  <slot></slot>
</div>

<style>
  .page {
    position: fixed;
    overflow-y: auto;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    visibility: hidden
  }
  .visible {
    visibility: visible
  }
</style>