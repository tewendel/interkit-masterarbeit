<script>
  import { getContext } from 'svelte';
  import { TABS } from './BottomMenu.svelte';

  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);

  registerPanel(panel);
</script>


<div class="page" class:visible="{$selectedPanel === panel}">
  <slot></slot>
</div>

<style>
  .page {
    position: absolute;
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