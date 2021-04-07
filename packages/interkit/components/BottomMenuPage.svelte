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
    height: 100%;
    width: 100%;
    display: none;
  }
  .visible {
    display: block;
  }
</style>