<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'

  export let title;
  export let categoryRef;
  export let categoryTitleColumn;
  export let categoryDescriptionColumn;
  export let categoryImageColumn;

  let categoryRow;

  const loadCategoryRow = async (categoryRef) => {
    if(categoryRef?.rowIds?.[0])
      categoryRow = await InterkitClient.call("row.get", categoryRef.rowIds[0])
  }

  // load categoryRow when ref changes
  $: {
    loadCategoryRow(categoryRef)
  }

  const openCategory = ()=>{
    InterkitClient.callGlobalMethod("featuredCategoryPage")
    InterkitClient.callGlobalMethod("featuredCategoryTab")
    InterkitClient.callGlobalMethod("featuredCategoryView", {category: categoryRow})
  }

</script>

<div class="feature-container" on:click={openCategory}> 

  {#if categoryRow}
    <h3>{title}</h3>
    <h4>{util.rowVal(categoryRow, categoryTitleColumn)}</h4>
    <MediaFileImage mediafileRef={util.rowVal(categoryRow, categoryImageColumn)} />    
    <div>{util.rowVal(categoryRow, categoryDescriptionColumn)}</div>
  {/if}

</div>

<style>

  .feature-container {
    border: 1px solid gray;
    padding: 5px;
  }
</style>