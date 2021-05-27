<script>

  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import TopNavBar from './TopNavBar.svelte'

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

<div class="ListNav list-nav-container" data-categories={$singleViewData?.categorySheetKey}>

  <div class:active={$singleViewData}>
    <TopNavBar 
      icon="arrow-left" 
      onClick={()=>{setSingleView(null)}}
      pageOpen
    >
      {$singleViewData?.filterCategoryName}
    </TopNavBar>
    <slot name="singleView"></slot>
  </div>

  <div class:active={!$singleViewData}>
    <slot name="listView"></slot>
  </div>

</div>

<style>

  .list-nav-container {
    height: 100%;
  }

  span:hover {
    cursor: pointer;
  }

  div.list-nav-container div {
    display: none;
  }

  div.list-nav-container .active {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>