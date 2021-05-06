<script>

  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';

  // get function to hide tabnav
  import { TABS } from './Tabs.svelte';  
  let setHideTabNav;
  if(TABS) {
    let tabsContext = getContext(TABS);
    setHideTabNav = tabsContext?.setHideTabNav
  }

  // set up a store and expose it via context api to children
  let singleViewData = writable(null);
  const setSingleView = (data) => {
    //console.log("setSingleView", data)
    singleViewData.set(data);
    if(setHideTabNav) setHideTabNav(data ? true : false); // tell parent Tabs component to hide tabs navigation
  };
  
  // context for children (for example ElementList)
  setContext("listNav", {
    setSingleView,
    singleViewData 
  });

  
</script>

<div class:active={$singleViewData}>
  <span on:click={()=>{setSingleView(null)}}>{"<"} {$singleViewData?.filterCategoryName}</span>
  <slot name="singleView"></slot>
</div>

<div class:active={!$singleViewData}>
  <slot name="listView"></slot>
</div>

<style>
  span:hover {
    cursor: pointer;
  }

  div {
    display: none;
  }

  .active {
    display: block;
  }
</style>