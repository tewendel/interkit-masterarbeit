<script>

  import { InterkitClient, util } from '../'
  import { onMount, getContext } from 'svelte'
  import MediaFileImage from './MediaFileImage.svelte';

  let listNavContext = getContext("listNav");

  export let categorySheetKey;
  export let nameKey;
  export let imageKey;
  export let descriptionKey;

  let projectId = INTERKIT_PROJECT_ID

  let categorySub
  let categories
  let filterCategoryKey

  onMount(async ()=>{    
    //console.log("mount archive category")
    categorySub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: categorySheetKey, projectId}], r=>r.sheetKey==categorySheetKey);
    categories = categorySub.data;  
  })

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

{#if $categories}
<ul>
  {#each $categories as category}
  <li on:click={()=>{openCategory(category)}}>
    <h3>{util.rowVal(category, nameKey)}</h3>
    <MediaFileImage mediafileRef={util.rowVal(category, imageKey)} />    
    <div>{util.rowValString(category, descriptionKey)}</div>
  </li>
  {/each}
</ul>
{/if}

<style>
  li:hover {
    cursor: pointer;
  }
</style>