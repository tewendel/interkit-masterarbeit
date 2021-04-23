<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab);

  export let label;
</script>

<button class="Tabs__Tab tab" class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
	<span class="Tabs__Tab__Text text">
		{label}
	</span>
</button>

<style>
	button {
		flex: 1;
		border: 2px solid black;
		border-width: 0 0 2px 0;
		padding: 1ex;
		position: relative;
	}

	button:not(:first-child):before {
		content: "";
		height: 60%;
		width: 2px;
		position: absolute;
		left:0;
		bottom: 0;
		background-color: black;
	}

	.text {
		text-transform: uppercase;
		font-weight: 500;
		line-height: 100%;
	}

	button:first-child {
		border-left: none;
	}
	
	.selected {
		border: none;
	}
</style>
