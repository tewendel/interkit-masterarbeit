<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit-shared'
  
  export let projectId
  export let sheetColumn

  let sheets;
  let subHandle;

  onMount(async ()=> {
    subHandle = await InterkitClient.getSub('sheets', 'sheets', [projectId], (s)=>s.projectId == projectId);
    sheets = subHandle.data
  })

  onDestroy(()=>{
    subHandle.stop()
  })

  let selectedSheet;
  let selectedColumn;

  $: {
    if(selectedSheet && selectedColumn)
      sheetColumn = selectedSheet.id + "/" + selectedColumn.key
    else
      sheetColumn = undefined
    console.log(sheetColumn)
  }

</script>

{#if $sheets}
  <select bind:value={selectedSheet}>
    {#each $sheets as sheet}
      <option value={sheet}>
        {sheet.name}
      </option>
    {/each}
  </select>

  {#if selectedSheet}
    <select bind:value={selectedColumn}>
      {#each selectedSheet.columns as column}
        <option value={column}>
          {column.name}
        </option>
      {/each}
    </select>
  {/if}
{/if}