<script>

  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'

  export let categorySheet;
  export let categoryColumnKey;
  export let openCategory;

  let categorySub
  let categories

  onMount(async ()=>{    
    categorySub = await InterkitClient.getSub('rows', 'rows', [categorySheet._id], r=>r.sheetId==categorySheet._id);
    categories = categorySub.data;  
  })

</script>

{#if $categories && open}
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