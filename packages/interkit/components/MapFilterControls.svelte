<script>

  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let filterLists;
  export let setFilter;
  export let activeFilter;

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

  $: {
    //console.log(filterLists)  
  }
  
</script>

{#if filterLists?.length}
<div id="filterControls">
  
    {#if activeFilter}
      <span class="Map__ActiveFilter active_filter">
        <Button on:click={()=>filterSelect(null)}>
          {activeFilter.name} x
        </Button>
      </span>
    {/if}

    <span on:click={toggleFilters}>
      <Button>
      <Icon type="filter" height="1em" />
      filter
      </Button>
    </span>
    {#if filterSelectOpen}
      <ul class="Map__FilterList filter_list">
      {#each filterLists as filterList}
        <li>
          <Button>
            <span class:active={filterList == openFilterList} on:click={()=>{setOpenFilterList(filterList)}}>
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
        <li>
          <Button>
            <span on:click={()=>{
            filterSelect({
              name: filterName(categoryRow), 
              row: categoryRow,
              categoryColorColumn: openFilterList.categoryColorColumn,
              elementRefColumn: openFilterList.elementRefColumn
            })}}>{filterName(categoryRow)}
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
  }

  #filterControls span {
    padding: 2px;
  }

  #filterControls span:hover {
    cursor: pointer;
  }

  li {
    margin: 7px;
  }

  #filterControls span.active {
    background-color: gray;
  }

  .active_filter {
    position: absolute;
    top: 16px;
  }

  .filter_list, .filter_list_level_2 {
    display: flex; 
  }

  .filter_list_level_2 {
    max-width: 100%;
    overflow-x: auto;
  }

</style>