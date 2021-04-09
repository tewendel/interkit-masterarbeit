<script>
  import { InterkitClient } from '../'
  import { onMount, onDestroy } from 'svelte'

  export let dataSheetId

  // filters
  export let category
  export let categoryName
  
  export let close

  let dataSub
  let dataRows
  let dataSheet;
  let dataSheetColumnKey;
  let refKey;

  onMount(async ()=>{

    // load the sheet 
    dataSheet = await InterkitClient.call('sheet.get', dataSheetId)

    //console.log(dataSheet)
    
    if(category) {
      // check if there is a column that references this categorySheet
      let refColumn = dataSheet.columns.find(c => c?.type == "sheetRef" && c?.reference == category.sheetId)
      refKey = refColumn?.key;
      //console.log("refKey", refKey)
    }

    // function to check if a row belongs to this category
    const check = (dataRow) => {
      //console.log(dataRow?.value?.[refKey]?.rowId, category.id)
      if(!category) return true
      return dataRow?.value?.[refKey]?.rowIds.includes(category.id)
    }

    // subscribe to the data
    dataSub = await InterkitClient.getSub('rows', 'rows', [dataSheetId], r=>{return (r.sheetId==dataSheetId) && check(r)});
    dataRows = dataSub.data;  
    //console.log($dataRows)

  })

  onDestroy(async ()=>{
    if(dataSub) {
      await dataSub.stop()
    }
  })

  

  
</script>

{#if category}
  <span class="back" on:click={close}>{"<"}</span>
  <h2>{categoryName}</h2>
{:else}
  <h2>all entries</h2>
{/if}

{#if $dataRows}
<ul>
  {#each $dataRows as row}
  <li>
    <slot name="contentElement" element={row}></slot>
  </li>
  {/each}
</ul>
{/if}

<style>
  .back {
    padding: 10px;
  }
  .back:hover {
    cursor: pointer;
  }
</style>