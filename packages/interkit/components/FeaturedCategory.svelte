<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import CategoryCover from './CategoryCover.svelte'
  import SectionHeadline from './SectionHeadline.svelte'

  let projectId = INTERKIT_PROJECT_ID;

  export let title;

  export let sectionRow;
  export let sectionColumns;
  export let categoryColumns;

  // select the categories to use
  let categoryIndex;
  let categoryRow;
  
  const setup = async (sectionRow) => {
    categoryIndex = util.getCategoryIndex(sectionRow, sectionColumns);
    if(typeof categoryIndex == "number") {
      // the rowKey of the category we want to display
      let sectionCategoryKey = util.rowVal(sectionRow, sectionColumns.categoryRefsColumn[categoryIndex])?.rowKeys?.[0]
      categoryRow = await InterkitClient.call("row.get", {key: sectionCategoryKey, projectId})
    }
  }

  $: setup(sectionRow);    
  
  const openCategory = ()=>{
    InterkitClient.callGlobalMethod("featuredCategoryPage")
    InterkitClient.callGlobalMethod("featuredCategoryTab")
    InterkitClient.callGlobalMethod("featuredCategoryView", {category: categoryRow})
  }

</script>

<div class="feature-container" on:click={openCategory}> 

  <h3>
    <SectionHeadline>
      {title}
    </SectionHeadline>
  </h3>
  {#if categoryRow}
    <CategoryCover 
      {categoryRow}
      titleColumn={categoryColumns[categoryIndex].titleColumn}
      imageColumn={categoryColumns[categoryIndex].imageColumn}
      descriptionColumn={categoryColumns[categoryIndex].descriptionColumn}
    />
  {/if}

</div>

<style>

  .feature-container {
    border: 1px solid gray;
    padding: 5px;
  }
</style>