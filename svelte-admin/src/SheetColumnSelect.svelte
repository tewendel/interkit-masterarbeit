<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  
  export let projectId
  export let sheetColumn

  //console.log(sheetColumn)

  let sheets;
  let subHandle;
  let selectedSheetId;
  let selectedColumnKey;
  let columns = [];

  const updateColums = (sheetId, resetSelected=false) => {
    //console.log("updateColums", resetSelected)
    columns = $sheets ? ($sheets.filter(s=>s.id == sheetId)?.[0]?.columns) : []
    //console.log(columns)
    if(resetSelected)
      selectedColumnKey = columns?.[0]?.key
  }

  const updateSheet = () => {
    updateColums(selectedSheetId, true)
  }

  onMount(async ()=> {
    subHandle = await InterkitClient.getSub('sheets', 'sheets', {projectId}, (s)=>s.projectId == projectId);
    sheets = subHandle.data    

    // initial values coming in through sheetColumn
    //console.log(sheetColumn)

    if(sheetColumn) {
      selectedSheetId = sheetColumn.split("/")?.[0]

      // if sheet not found reset to first one in list
      if(!$sheets.filter(s=>s.id == selectedSheetId).length) {
        selectedSheetId = $sheets?.[0]?.id;        
      }

      selectedColumnKey = sheetColumn.split("/")?.[1]
      updateColums(selectedSheetId, false)
    }
  })

  onDestroy(()=>{
    subHandle.stop()
  })

  // assemble sheetColumn when selection changes
  $: {
    //console.log("updating sheetColumn...")
    if(selectedSheetId && selectedColumnKey)
      sheetColumn = selectedSheetId + "/" + selectedColumnKey
    //console.log(sheetColumn)
  }
    
</script>

{#if $sheets}
  <select bind:value={selectedSheetId} on:change={updateSheet}>
    <option value={undefined}>nicht zugeordnet</option>
    {#each $sheets as sheet}
      <option value={sheet.id}>
        {sheet.name}
      </option>
    {/each}
  </select>

  {#if columns && selectedSheetId && $sheets}
    <select bind:value={selectedColumnKey}>
      <option value={undefined}>nicht zugeordnet</option>
      {#each columns as column}
        <option value={column.key}>
          {column.name}
        </option>
      {/each}
    </select>
  {/if}
{/if}