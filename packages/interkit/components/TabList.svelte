<script>
  import { getContext } from 'svelte';
  import { TABS } from './Tabs.svelte';
  const { hideTabNav } = getContext(TABS);
</script>


{#if !$hideTabNav}
	<div class="Tabs__TabList tab-list">
		<slot></slot>
	</div>
{/if}

<style>
	.tab-list {
		height: 50px;
		display: flex;
	}
</style>