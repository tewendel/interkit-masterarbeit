<script>
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';
  import { InterkitClient } from '../'

  export let path = null;

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


<div class="BottomMenuPage page" class:visible="{$selectedPanel === panel}">
  <slot></slot>
</div>

<style>
  .page {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
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