<script>

  import { InterkitClient, util } from '../'

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
    <span on:click={()=>filterSelect(null)}>{activeFilter.name} x</span>
  {:else}
    <span on:click={toggleFilters}>filter</span>
    {#if filterSelectOpen}
      <ul>
      {#each filterLists as filterList}
        <li><span class:active={filterList == openFilterList} on:click={()=>{setOpenFilterList(filterList)}}>{filterList.name}</span></li>
      {/each}
      </ul>
    {/if}
    {#if openFilterList && filterSelectOpen}
      <ul>
      {#each openFilterList.categoryRows as categoryRow}
        <li><span on:click={()=>{
          filterSelect({
            name: filterName(categoryRow), 
            row: categoryRow,
            categoryColorColumn: openFilterList.categoryColorColumn,
            elementRefColumn: openFilterList.elementRefColumn
          })}}>{filterName(categoryRow)}</span></li>
      {/each}
      </ul>
    {/if}
  {/if}
  

</div>
{/if}


<style>

  #filterControls {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    padding: 10px;
    z-index: 1000;
  }

  #filterControls span {
    background-color: white;
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

</style>