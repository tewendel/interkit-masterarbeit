<script>

  import { InterkitClient, util } from '../'
  import { onMount, getContext } from 'svelte'
  import MediaFileImage from './MediaFileImage.svelte';

  let listNavContext = getContext("listNav");

  export let categorySheetId;
  export let nameKey;
  export let imageKey;
  export let descriptionKey;

  // todo: register a method into the global namespace to switch to an item in this category
  /* InterkitClient.registerGlobalMethod("setCategoryFilter", (filterId)=>{setSingleView({categorySheetId, filterId, filterCategoryName: getValue(category, nameKey)});  )}) */
  
  let categorySub
  let categories
  let filterCategoryId

  onMount(async ()=>{    
    //console.log("mount archive category")
    categorySub = await InterkitClient.getSub('rows', 'rows', [categorySheetId], r=>r.sheetId==categorySheetId);
    categories = categorySub.data;  
  })

  const openCategory = (category)=> {
    filterCategoryId = category._id;
    if(listNavContext) {
      listNavContext.setSingleView({categorySheetId, filterCategoryId, filterCategoryName: util.rowVal(category, nameKey)});  
    }
  }

  // register a global function to open the listNav to this category
  InterkitClient.registerGlobalMethod("openCategory", ({category}) => {
    console.log(category)
    if(categorySheetId == category.sheetId)
      openCategory(category)
  });

</script>

{#if $categories}
<ul>
  {#each $categories as category}
  <li on:click={()=>{openCategory(category)}}>
    <h3>{util.rowVal(category, nameKey)}</h3>
    <MediaFileImage mediafileRef={util.rowVal(category, imageKey)} />    
    <div>{util.rowVal(category, descriptionKey)}</div>
  </li>
  {/each}
</ul>
{/if}

<style>
  li:hover {
    cursor: pointer;
  }
</style>