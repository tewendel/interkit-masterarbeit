<script>
  import { InterkitClient, util } from '../'
  import { onMount, getContext, onDestroy } from 'svelte'

  const listNavContext = getContext("listNav");
  const singleViewData = listNavContext?.singleViewData
  
  // this is the id of the sheet containing the categories
  let categorySheetKey
  
  // this is the id of one row in the category sheet used to filter the entries from the data sheet
  let filterCategoryKey; 
  
  // name of the category
  let filterCategoryName;
  

  $: {
    //console.log("singleViewData changed", $singleViewData);
    categorySheetKey = $singleViewData?.categorySheetKey;
    filterCategoryKey = $singleViewData?.filterCategoryKey;
    filterCategoryName = $singleViewData?.filterCategoryName;
    setupSub();    
  }

  // the key of the sheet from which to get the data
  export let dataSheetKey 

  // the column key to use for sorting the elements
  export let sortColumn
  
  let projectId = INTERKIT_PROJECT_ID;

  let dataSub
  let dataRows // the store that contains the data we subscribe to
  let dataSheet; // the sheet object
  let refKey; // the key of the column in the data sheet that references the category sheet
  let dataRowsSorted; // 

  const setupSub = async ()=> {

    //console.log(dataSheet)
    if(!dataSheet) return
    
    if(filterCategoryKey) {
      // find the reference column in the data sheet that references the category sheet
      let refColumn = dataSheet.columns.find(c => c?.type == "sheetRef" && c?.reference == categorySheetKey)
      refKey = refColumn?.key;
      console.log("refKey", refKey)
    }

    // function to check if a row from the data sheet references the filter category
    const check = (dataRow) => {
      if(!filterCategoryKey) return true
      return dataRow?.values?.[refKey]?.rowKeys?.includes(filterCategoryKey)
    }

    if(dataSub) await dataSub.stop()
    // subscribe to the data
    dataSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: dataSheetKey, projectId}], r=>{return (r.sheetKey==dataSheetKey) && check(r)});
    dataRows = dataSub.data;  
    console.log("dataRows", $dataRows)
    console.log(sortColumn)
    dataRows.subscribe((data) => {
      data.sort((a, b) => util.rowVal(a, sortColumn) - util.rowVal(b, sortColumn))
      dataRowsSorted = data;
    })

  }



  onMount(async ()=>{
    // load the sheet 
    dataSheet = await InterkitClient.call('sheet.get', {key: dataSheetKey, projectId})
    await setupSub();
  })

  onDestroy(async ()=>{
    if(dataSub) {
      await dataSub.stop()
    }
  })


  
</script>

{#if dataRowsSorted}
<ul>
  {#each dataRowsSorted as row}
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