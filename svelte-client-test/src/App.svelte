<script>

  import { onMount } from 'svelte'
  import InterkitClient from './interkit-client.js'

  let sheetId;
  let rows;
  
  onMount(async ()=>{
    await InterkitClient.connect("localhost:3000");
  })

  const getRows = async ()=>{
    rows = await InterkitClient.getStoreForSheetRows(sheetId)
  }

</script>

<h2>test svelte client to interface with meteor-server</h2>

sheetId: <input bind:value={sheetId}>
<button on:click={getRows}>load and watch rows</button>

{#if rows}
  <ul>
  {#each $rows as row} 
    <li>{JSON.stringify(row.value)}</li>  
  {/each}
  </ul>
{/if}
