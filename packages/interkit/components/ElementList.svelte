<script>
  import { InterkitClient, util } from '../'
  import { onMount, getContext, onDestroy } from 'svelte'
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  // the key of the sheet from which to get the data
  export let dataSheetKey 

  // the column key to use for sorting the elements
  export let sortColumn

  // the column to use for hiding individual elements
  export let hideColumn

  // name of the trigger to activate on select
  export let selectTrigger

  // set this option to only show elements that are bookmarked locally on the client
  export let bookmarkFilter // this is TRUE or FALSE
  let bookmarkStore;
  if(bookmarkFilter == "TRUE")
    bookmarkStore = InterkitClient.getGlobalStore("elementProperties")

  const listNavContext = getContext("listNav");
  const singleViewData = listNavContext?.singleViewData

  const scrollContext = getContext("scrollContainer")

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

  $: {
    if($bookmarkStore) setupSub();
  }

  let dataSub
  let dataRows // the store that contains the data we subscribe to
  let dataSheet; // the sheet object
  let refKey; // the key of the column in the data sheet that references the category sheet
  let dataRowsSorted; // 

  const setupSub = async ()=> {

    scrollContext?.scrollUp();

    //console.log(dataSheet)
    if(!dataSheet) return
    
    if(filterCategoryKey) {
      // find the reference column in the data sheet that references the category sheet
      let refColumn = dataSheet.columns.find(c => c?.type == "sheetRef" && c?.reference == categorySheetKey)
      refKey = refColumn?.key;
      //console.log("refKey", refKey)
    }

    // function to check if a row from the data sheet references the filter category
    const check = (dataRow) => {
      if(!filterCategoryKey) return true
      return dataRow?.values?.[refKey]?.rowKeys?.includes(filterCategoryKey)
    }

    const checkBookmark = (dataRow) => {
      //console.log("bookmarkFilter", bookmarkFilter);
      if(bookmarkFilter != "TRUE") return true;
      if(bookmarkFilter && $bookmarkStore) {
        if($bookmarkStore?.[dataRow.key]?.bookmarked)
          return true;
        else 
          return false;
      }
    }

    const checkHidden = (dataRow) => {
      return util.rowVal(dataRow, hideColumn) != "true"
    }

    //if(dataSub) await dataSub.stop()
    // subscribe to the data
    //dataSub = await InterkitClient.getSub('rows', 'rows', {sheetKey: dataSheetKey}, r=>{return (r.sheetKey==dataSheetKey) && check(r) && checkBookmark(r)});
    
    dataRows = await InterkitClient.getRowSubStore(dataSheetKey);
    //console.log("dataRows", $dataRows)
    //console.log(sortColumn)
    dataSub = dataRows.subscribe((data) => {
      data = data.filter(r => check(r) && checkBookmark(r) && checkHidden(r))
      data.sort((a, b) => util.rowVal(a, sortColumn) - util.rowVal(b, sortColumn))
      dataRowsSorted = data;
    })

  }



  onMount(async ()=>{
    // load the sheet 
    dataSheet = await InterkitClient.getSheet(dataSheetKey);
    await setupSub();
  })

  onDestroy(async ()=>{
    if(dataSub) {
      dataSub();
    }
  })

  const onClick = (element) => {

    console.log("onClick", element)
    
    // if we are in listNave, set the context
    if(listNavContext)
      listNavContext?.setSingleView(element);

    // also trigger the action, if set
    if(selectTrigger)
      executeTrigger(selectTrigger, element)
  }


</script>

{#if dataRowsSorted}
  {#if dataRowsSorted.length == 0}
    <slot name="emptyElement"></slot>
  {:else}
    <ul>
      {#each dataRowsSorted as row}
        <li class="item" on:click={()=>{onClick(row)}}>
          <slot name="contentElement" element={{...row, size: bookmarkStore ? "s" : "l"}}></slot>
          <span class="right-arrow"><Button type="secondary"><Icon type="arrow-right"/></Button></span>
        </li>
      {/each}
    </ul>
  {/if}

{/if}


<style>
  .back {
    padding: 10px;
  }
  .back:hover {
    cursor: pointer;
  }

  li.item {
    position: relative;
  }
  .right-arrow {
    position:  absolute;
    bottom: 10px;
    right:  25px;
  }

</style>