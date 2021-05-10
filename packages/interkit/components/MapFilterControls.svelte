<script>

  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let filterLists;
  export let setFilter;
  export let activeFilter;
  export let isFocused;

  let filterSelectOpen = false;

  const toggleFilters = () => {
    filterSelectOpen = !filterSelectOpen;
  }
  let openFilterList;
  const setOpenFilterList = (filterList) => {
    openFilterList = filterList;
  }

  const filterSelect = (filter) => {
    filterSelectOpen = false;
    openFilterList = null;
    setFilter(filter);
  }

  const filterName = (categoryRow) => {
    return util.rowVal(categoryRow, openFilterList.categoryNameColumn)
  }

  const filterColorRGB = (categoryRow) => {
    try {
      let rgbArray = JSON.parse(util.rowVal(categoryRow, openFilterList.categoryColorColumn))
      const c = (index) => Math.floor(rgbArray[index] * 256)
      return `rgb(${c(0)},${c(1)},${c(2)})`
    } catch(e) {
      console.log(e)
    }
  }

  $: {
    if (!isFocused) filterSelectOpen = false // trigger closing
    //console.log(filterLists)  
  }
  
</script>

{#if activeFilter}
  <span class="Map__ActiveFilter active_filter active">
    <Button nopadding>
      <span class="Map__ActiveFilter__Item active_filter_item">
        <span class="label">
          {activeFilter.name}
        </span>
        <Icon type="close" height="1em" on:click={()=>filterSelect(null)} />
      </span>
    </Button>
  </span>
{/if}

{#if filterLists?.length}
  <div id="filterControls" on:click>
    <span class="Map__FilterButton filter_button" class:active={filterSelectOpen}>
      <Button nopadding on:click={toggleFilters}>
        <span class="Map__FilterButton__Item filter_button_item" >
          <Icon type="filter" height="1em" />
            Filter
        </span>
      </Button>
    </span>
    

    {#if filterSelectOpen}
      <ul class="Map__FilterList filter_list">
      {#each filterLists as filterList}
        <li class:active={filterList == openFilterList} >
          <Button nopadding>
            <span 
              class="Map__FilterList__Item filter_list_item"  
              on:click={()=>{setOpenFilterList(filterList)}}>
                {filterList.name}
            </span>
          </Button>
        </li>
      {/each}
      </ul>
    {/if}

    {#if openFilterList && filterSelectOpen}
      <ul class="Map__FilterListLevel2 filter_list_level_2">
      {#each openFilterList.categoryRows as categoryRow}
        <li class:active={activeFilter && activeFilter.name == filterName(categoryRow)} >
          <Button nopadding color={filterColorRGB(categoryRow)}>
            <span 
              class="Map__FilterListLevel2__Item filter_list_level_2_item" 
              on:click={()=>{
            filterSelect(activeFilter && activeFilter.name == filterName(categoryRow) ? null : {
              name: filterName(categoryRow), 
              row: categoryRow,
              categoryColorColumn: openFilterList.categoryColorColumn,
              elementRefColumn: openFilterList.elementRefColumn
            })}}>
              {filterName(categoryRow)}
            </span>
          </Button>
        </li>
      {/each}
      </ul>
    {/if}


</div>
{/if}


<style>

  #filterControls {
    display: flex;
    flex-direction: column-reverse;
    place-items: flex-end;
    position: absolute;
    right: 0;
    bottom: 55px;
    z-index: 1000;
    font-size: 14px;
    line-height: 20px;
  }

  #filterControls span:hover {
    cursor: pointer;
  }

  .filter_button,
  .filter_list,
  .filter_list_level_2 {
    padding-right: 55px;
  }

  .filter_list,
  .filter_list_level_2 {
    max-width: 100%;
    overflow-y: auto;
  }

  li {
    margin: 8px 0 8px 14px;
    white-space: nowrap;
  }


  .active {
    filter: invert(1);
  }

  .active_filter {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1000;
  }

  .active_filter_item .label {
    max-width: calc(50vw - 64px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .filter_list, .filter_list_level_2 {
    display: flex; 
  }

  .filter_list_level_2 {
    max-width: 100vw;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0 55px;
  }

  .filter_list_level_2 > :last-child {
    padding-right: 55px;
  }

  .filter_button_item,
  .active_filter_item,
  .filter_list_item,
  .filter_list_level_2_item {
    padding: 8px;
    display: inline-block;
  }


</style>