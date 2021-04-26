<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'

  let projectId = INTERKIT_PROJECT_ID;

  export let title;

  export let sectionRow;
  export let sectionColumns;
  export let categoryColumns;

  // select the categories to use
  let categoryIndex = util.getCategoryIndex(sectionRow, sectionColumns);
  
  let categoryRow;
  onMount(async ()=>{
    if(typeof categoryIndex == "number") {
      // the rowKey of the category we want to display
      let sectionCategoryKey = util.rowVal(sectionRow, sectionColumns.categoryRefsColumn[categoryIndex])?.rowKeys?.[0]
      categoryRow = await InterkitClient.call("row.get", {key: sectionCategoryKey, projectId})
    }
  });
  
  const openCategory = ()=>{
    InterkitClient.callGlobalMethod("featuredCategoryPage")
    InterkitClient.callGlobalMethod("featuredCategoryTab")
    InterkitClient.callGlobalMethod("featuredCategoryView", {category: categoryRow})
  }

</script>

<div class="feature-container" on:click={openCategory}> 

  {#if categoryRow}
    <h3>{title}</h3>
    <h4>{util.rowVal(categoryRow, categoryColumns[categoryIndex].titleColumn)}</h4>
    <MediaFileImage mediafileRef={util.rowVal(categoryRow, categoryColumns[categoryIndex].imageColumn)} />    
    <div>{util.rowValString(categoryRow, categoryColumns[categoryIndex].descriptionColumn)}</div>
  {/if}

</div>

<style>

  .feature-container {
    border: 1px solid gray;
    padding: 5px;
  }
</style>