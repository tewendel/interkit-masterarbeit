<script>

  import { InterkitClient } from 'interkit-shared'
  import { onMount } from 'svelte'

  export let categorySheetId;
  export let categoryColumnKey;
  let categoryName;

  export let openCategory;
  
  let categorySub
  let categories

  let categorySheet;

  onMount(async ()=>{
    
    let categorySheet = await InterkitClient.call('sheet.get', categorySheetId)
    console.log(categorySheet)
    categoryName = categorySheet.name

    categorySub = await InterkitClient.getSub('rows', 'rows', [categorySheetId], r=>r.sheetId==categorySheetId);
    categories = categorySub.data;  
    //console.log($categories)
  })

</script>

<h2>{categoryName}</h2>
{#if $categories}
<ul>
  {#each $categories as category}
  <li on:click={()=>openCategory({
    row: category, 
    name: category.value[categoryColumnKey]
  })}>
    {category.value[categoryColumnKey]}
  </li>
  {/each}
</ul>
{/if}


<style>
  li:hover {
    cursor: pointer;
  }
</style>