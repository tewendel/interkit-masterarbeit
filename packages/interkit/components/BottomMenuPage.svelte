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
    overflow-y: scroll;
    display: block;
    width: 100%;
    height: 100%;
  }

  .page:not(.visible) {
    position: absolute;
    z-index:-1;
  }

  page.visible {
    position: static;
    display: block;
  }
</style>