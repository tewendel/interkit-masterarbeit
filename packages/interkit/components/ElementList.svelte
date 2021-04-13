<script>
  import { InterkitClient } from '../'
  import { onMount, getContext, onDestroy } from 'svelte'

  const { singleViewData } = getContext("listNav");

  let categorySheetId
  // this is the id of the sheet containing the categories

  let filterCategoryId; 
  // this is the id of one row in the category sheet used to filter the entries from the data sheet

  let filterCategoryName;
  // name of the category

  $: {
    console.log("singleViewData changed", $singleViewData);
    categorySheetId = $singleViewData?.categorySheetId;
    filterCategoryId = $singleViewData?.filterCategoryId;
    filterCategoryName = $singleViewData?.filterCategoryName;
    setupSub();    
  }

  export let dataSheetId // the id of the sheet from which to get the data
  
  let dataSub
  let dataRows // the store that contains the data we subscribe to
  let dataSheet; // the sheet object
  let refKey; // the key of the column in the data sheet that references the category sheet

  const setupSub = async ()=> {

    console.log(dataSheet)
    if(!dataSheet) return
    
    if(filterCategoryId) {
      // find the reference column in the data sheet that references the category sheet
      let refColumn = dataSheet.columns.find(c => c?.type == "sheetRef" && c?.reference == categorySheetId)
      refKey = refColumn?.key;
      //console.log("refKey", refKey)
    }

    // function to check if a row from the data sheet references the filter category
    const check = (dataRow) => {
      if(!filterCategoryId) return true
      return dataRow?.value?.[refKey]?.rowIds.includes(filterCategoryId)
    }

    if(dataSub) await dataSub.stop()
    // subscribe to the data
    dataSub = await InterkitClient.getSub('rows', 'rows', [dataSheetId], r=>{return (r.sheetId==dataSheetId) && check(r)});
    dataRows = dataSub.data;  
    console.log($dataRows)

  }

  onMount(async ()=>{
    // load the sheet 
    dataSheet = await InterkitClient.call('sheet.get', dataSheetId)
    await setupSub();
  })

  onDestroy(async ()=>{
    if(dataSub) {
      await dataSub.stop()
    }
  })


  
</script>

{#if filterCategoryName}
  <h2>{filterCategoryName}</h2>
{:else}
  <h2>alles</h2>
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