<script>

  import { InterkitClient } from '../'
  import { onMount, getContext } from 'svelte'
  import MediaFileImage from './MediaFileImage.svelte';

  const { setSingleView } = getContext("listNav");

  export let categorySheetId;
  export let nameKey;
  export let imageKey;
  export let descriptionKey;

  const getValue = (row, columnKey) => {
    return row.value[columnKey.split("/")[1]]
  }
  
  let categorySub
  let categories
  let filterCategoryId

  onMount(async ()=>{    
    console.log("mount archive category")
    categorySub = await InterkitClient.getSub('rows', 'rows', [categorySheetId], r=>r.sheetId==categorySheetId);
    categories = categorySub.data;  
  })

  const openCategory = (category)=> {
    filterCategoryId = category._id;
    setSingleView({categorySheetId, filterCategoryId, filterCategoryName: getValue(category, nameKey)});
  }

</script>

{#if $categories}
<ul>
  {#each $categories as category}
  <li on:click={()=>{openCategory(category)}}>
    <h3>{getValue(category, nameKey)}</h3>
    <MediaFileImage mediafileRef={getValue(category, imageKey)} />    
    <div>{getValue(category, descriptionKey)}</div>
  </li>
  {/each}
</ul>
{/if}

<style>
  li:hover {
    cursor: pointer;
  }
</style>