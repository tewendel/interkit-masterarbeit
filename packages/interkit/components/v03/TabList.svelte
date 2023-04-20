<script>
  import { getContext } from 'svelte';
  import { TABS } from './Tabs.svelte';
  const { hideTabNav } = getContext(TABS);
</script>


<div class:visible={!$hideTabNav} class="Tabs__TabList tab-list">
	<slot></slot>
</div>

<style>
	.tab-list {
		height: 50px;
		display: flex;
    visibility: hidden;
    height: 0px;
	}

  .visible {
    visibility: visible;
    height: auto;
  }

</style>