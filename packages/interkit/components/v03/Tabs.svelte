<script context="module">
  import TabList from './TabList.svelte';
	export const TABS = {};
</script>

<script>
	import { setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	const tabs = [];
	const panels = [];
	const selectedTab = writable(null);
	const selectedPanel = writable(null);
  const hideTabNav = writable(false);

	setContext(TABS, {
		registerTab: tab => {
			tabs.push(tab);
			selectedTab.update(current => current || tab);
			
			onDestroy(() => {
				const i = tabs.indexOf(tab);
				tabs.splice(i, 1);
				selectedTab.update(current => current === tab ? (tabs[i] || tabs[tabs.length - 1]) : current);
			});
		},

		registerPanel: panel => {
			panels.push(panel);
			selectedPanel.update(current => current || panel);
			
			onDestroy(() => {
				const i = panels.indexOf(panel);
				panels.splice(i, 1);
				selectedPanel.update(current => current === panel ? (panels[i] || panels[panels.length - 1]) : current);
			});
		},

		selectTab: tab => {
      //console.log("selectedTab")
			const i = tabs.indexOf(tab);
			selectedTab.set(tab);
			selectedPanel.set(panels[i]);
		},

    selectPanel: (panel) => {
      const i = panels.indexOf(panel);  
      selectedPanel.set(panel)
      selectedTab.set(tabs[i])      
    },

		selectedTab,
		selectedPanel,

    setHideTabNav: (value) => {
      //console.log("setHideTabNav", value)
      hideTabNav.set(value)
    },
    hideTabNav
	});
</script>

<div class="Tabs tabs">
	<TabList>
		<slot name="tabList"></slot>
	</TabList>
  <slot name="tabPanels" class="Tabs__Panel panel"></slot>
</div>

<style>
	.tabs {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.panel {
		flex: 1;
	}
</style>