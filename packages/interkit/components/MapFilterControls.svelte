<script>

  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let filterLists;
  export let setFilter;
  export let activeFilter;
  export let isFocused;
  export let onClose;

  let filterSelectOpen = false; // show first level of filters

  const toggleFilters = () => {
    filterSelectOpen = !filterSelectOpen;
    if(!filterSelectOpen && onClose) {
      onClose();
    }
  }
  let openFilterList; 
  console.log(openFilterList)

  $: {
    if(filterLists?.length) openFilterList = filterLists[0] // show second level of filters by default
  }
  
  const setOpenFilterList = (filterList) => {
    openFilterList = filterList;
  }

  const filterSelect = (filter) => {
    filterSelectOpen = false;
    //openFilterList = null;
    setFilter(filter);
  }

  const filterName = (categoryRow) => {
    return util.rowVal(categoryRow, openFilterList.categoryNameColumn)
  }

  $: {
    if (!isFocused) filterSelectOpen = false // trigger closing
    //console.log(filterLists)  
  }

  const sortCategories = (_categories, orderColumn) => {
    console.log(_categories, orderColumn)
    return _categories ? [..._categories].sort((a, b) => util.rowVal(a, orderColumn) - util.rowVal(b, orderColumn)) : null
  }
  
</script>



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
    
    <ul class="Map__FilterList filter_list" class:open="{filterSelectOpen}">
      {#each filterLists as filterList}
        <li class:active={filterList == openFilterList} >
          <Button nopadding>
            <span 
              class="Map__FilterList__Item filter_list_item"  
              on:click={()=>{setOpenFilterList(filterList)}}>
                {filterList.name}
            </span>
          </Button>
        
          <ul class="Map__FilterListLevel2 filter_list_level_2" class:open="{filterList == openFilterList}">
          {#each sortCategories(filterList.categoryRows, filterList.categoryOrderColumn) as categoryRow}
            <li class:active={activeFilter && activeFilter.name == filterName(categoryRow)} >
              <Button 
                nopadding 
                color={!(activeFilter && activeFilter.name == filterName(categoryRow)) ? 
                  util.filterColorRGB(categoryRow, filterList.categoryColorColumn) : null}
              >
                <span 
                  class="Map__FilterListLevel2__Item filter_list_level_2_item" 
                  on:click={()=>{
                filterSelect(activeFilter && activeFilter.name == filterName(categoryRow) ? null : {
                  name: filterName(categoryRow), 
                  row: categoryRow,
                  categoryColorColumn: filterList.categoryColorColumn,
                  elementRefColumn: filterList.elementRefColumn,
                  filterKeyColumn: filterList.filterKeyColumn,
                  connectedLayerKeyColumn: filterList.connectedLayerKeyColumn,
                })}}>
                  {filterName(categoryRow)}
                </span>
              </Button>
            </li>
          {/each}
          </ul>
          
        </li>
      {/each}
    </ul>
    
</div>
{/if}


<style>

  #filterControls {
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

  .filter_button {
    display: none;
  }

  .filter_list,
  .filter_list_level_2 {
    max-width: 100%;
    overflow-y: auto;
  }

  li {
    margin: 8px 0 8px 0px;
    white-space: nowrap;
  }

  .active {
    filter: invert(1);
  }

  .filter_list_level_2 {
    display: flex; 
  }

  .filter_list_level_2 {
    max-width: 100vw;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .filter_list_level_2 > :last-child {
    padding-right: 55px;
  }

  .filter_button_item,
  .filter_list_item,
  .filter_list_level_2_item {
    padding: 8px;
    display: inline-block;
  }


</style>