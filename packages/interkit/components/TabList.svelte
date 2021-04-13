<script>
  import { getContext } from 'svelte';
  import { TABS } from './Tabs.svelte';
  const { hideTabNav } = getContext(TABS);
</script>


{#if !$hideTabNav}
<div class="tab-list">
	<slot></slot>
</div>
{/if}

<style>
	.tab-list {
		border-bottom: 1px solid teal;
	}
</style>