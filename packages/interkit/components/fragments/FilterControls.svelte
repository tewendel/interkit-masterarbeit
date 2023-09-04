<script>
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();

  import FilterSegment from "./FilterSegment.svelte"

  export let mainClass = ''
  export let filters = [];
  export let updateActiveViews  

  const update = () => {
    updateActiveViews(filters.filter(f => f.state == "selected"), "activeFilters")
  }
  
  if($showDummyData) {
    filters = [
      {titleColumn: "filter 1", state: "enabled"},
      {titleColumn: "filter 2", state: "enabled"},
      {titleColumn: "filter 3", state: "selected"},
      {titleColumn: "filter 4", state: "enabled"},
      {titleColumn: "filter 5", state: "enabled"},
      {titleColumn: "filter 6", state: "enabled"},
      {titleColumn: "filter 7", state: "selected"},
      {titleColumn: "filter 8", state: "enabled"}
    ]
    update()
  }

  const setFilterState = (filter, state) => {
    filter.state = state;
    filters = filters;
    //console.log(filters);
    update()
  }

</script>

<div class="container FilterControls {mainClass}">
  <div class="filter-segments FilterControls__Segments">
    {#each filters as filter}
      {#if !filter.state || filter.state == "enabled"}
        <FilterSegment text={filter.titleColumn} on:click={()=>{setFilterState(filter, "selected")}}/>
      {/if}
      {#if filter.state == "selected"}
        <FilterSegment state="selected" text={filter.titleColumn} on:click={()=>{setFilterState(filter, "enabled")}}/>
      {/if}
    {/each}
  </div>
</div>

<style>
  .container {
    position: fixed;
    top: calc(var(--outset-y) * 1rem + var(--inset-y) * 0.5rem + 2rem);
    left: 0;
    right: 0;
    z-index: 2;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding:
      calc(var(--outset-y) * 0.5rem)
      0;
    gap: calc(var(--outset-x) * 0.25rem);
  }
  
  .filter-segments {
    /* height: 44px; */
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    /* FIXME: when scrollbar is visible, the buttons appear very thin */
    gap: calc(var(--outset-x) * 0.5rem);
    padding:
      0
      calc(var(--outset-x) * 0.5rem)
      calc(var(--outset-y) * 0.25rem)
      calc(var(--outset-x) * 0.5rem);
  }


</style>




