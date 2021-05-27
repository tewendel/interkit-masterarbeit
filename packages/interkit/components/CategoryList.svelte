<script>

  import { InterkitClient, util } from '../'
  import { onMount, getContext } from 'svelte'
  import MediaFileImage from './MediaFileImage.svelte';
  import CategoryCover from './CategoryCover.svelte';

  let listNavContext = getContext("listNav");

  export let categorySheetKey;
  export let nameKey;
  export let imageKey;
  export let descriptionKey;
  export let unlistedKey;

  //let categorySub
  let categories
  let filterCategoryKey

  onMount(async ()=>{    
    //console.log("mount archive category")
    //categorySub = await InterkitClient.getSub('rows', 'rows', {sheetKey: categorySheetKey}, r=>r.sheetKey==categorySheetKey && !util.rowVal(r, unlistedKey));
    categories = await InterkitClient.getRowSubStore(categorySheetKey)
  })

  $: categories_filtered = $categories?.filter(r => !util.rowVal(r, unlistedKey))

  const openCategory = (category)=> {
    filterCategoryKey = category.key;
    if(listNavContext) {
      listNavContext.setSingleView({categorySheetKey, filterCategoryKey, filterCategoryName: util.rowVal(category, nameKey)});  
    }
  }

  // register a global function to open the listNav to this category
  InterkitClient.registerGlobalMethod("featuredCategoryView", ({category}) => {
    console.log(category)
    if(categorySheetKey == category.sheetKey)
      openCategory(category)
  });

</script>

{#if categories_filtered}
<ul class="CategoryList" data-categories={categorySheetKey}>
  {#each categories_filtered as category}
  <li on:click={()=>{openCategory(category)}}>
    <CategoryCover 
      categoryRow={category}
      titleColumn={nameKey}
      imageColumn={imageKey}
      descriptionColumn={descriptionKey}
    />
  </li>
  {/each}
</ul>
{/if}

<style>
  li:hover {
    cursor: pointer;
  }
</style>