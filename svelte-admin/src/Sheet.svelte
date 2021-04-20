<script>
  import { InterkitClient } from 'interkit'
  import { DataTable, OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
  import InputModal from './InputModals/InputModal.svelte';
  import SheetCell from './SheetCell.svelte';
  import { columnTypes } from './baseConfig.js';
  import { onDestroy } from 'svelte';

  export let sheetKey;
  export let projectId;
  export let close;

  let headerTypeModal = null; // set to "columnType" when open
  let updateHeader = {} // the value of the column being changed

  let openInputModal = null; // the type of the input modal to open
  let updateRow;  // the row being edited in modal
  let updateCell; // the cell being edited in modal
  let inputModalValue; // value edited in input modal
  let modalParams; // object of optional params passed to input modal

  let rowsSubHandle;
  let rows;

  let currentSheetSub;
  let currentSheet;

  const setup = async (newKey) => {
    if(newKey) {
      // subscribe to the rows of the current sheet
      if(rowsSubHandle) rowsSubHandle.stop()
      rowsSubHandle = await InterkitClient.getSub('rows', 'rows', [{sheetKey, projectId}], (r)=>r.sheetKey == newKey);
      rows = rowsSubHandle.data;

      // subscribe to the current sheet itself
      if(currentSheetSub) currentSheetSub.stop()
      currentSheetSub = await InterkitClient.getSub('sheets', 'sheets', [{key: sheetKey, projectId}], (s)=>s.key == sheetKey, true);
      currentSheet = currentSheetSub.data;      
    }
  }

  // initialize the row subscriptions when id prop changes
  $: setup(sheetKey)

  let refSubs = {};
  let refData = {};
  let refDataUnsubscribe = {};
  
  // setup subscriptions for other sheets referenced in columns
  const updateReferenceSubscriptions = async (sheet) => {
    if(sheet?.columns) {
      for(let column of sheet.columns.filter(c=>c.type == "sheetRef")) {
        let refSheetKey = column.reference

        if(refSubs[refSheetKey]) refSubs[refSheetKey].stop()
        refSubs[refSheetKey] = await InterkitClient.getSub('rows', 'rows', [{sheetKey: refSheetKey, projectId}], (r)=>r.sheetKey == refSheetKey);
        
        // manually (un)subscribe to the store to update data
        if(refDataUnsubscribe[refSheetKey]) refDataUnsubscribe[refSheetKey]()
        
        refDataUnsubscribe[refSheetKey] = refSubs[refSheetKey].data.subscribe(data => {
          //console.log("ref data Update")
          refData[refSheetKey] = data;
        })
      }
    }
  }

  // watch updates on currentSheet to adjust subscriptions for reference columns
  $: {
    //console.log("currentSheet updated", $currentSheet)
    updateReferenceSubscriptions($currentSheet)
  }

  // some cleanup
  onDestroy(()=>{
    if(currentSheetSub)
      currentSheetSub.stop();

    if(rowsSubHandle) 
      rowsSubHandle.stop()

    for(let sub of Object.values(refSubs)) {
      sub.stop();
    }

    for(let unsub of Object.values(refDataUnsubscribe)) {
      unsub();
    }
  })


  const rename = () => {
    let newName = prompt("Rename sheet", $currentSheet.name)
    InterkitClient.call('sheet.rename', {key: sheetKey, projectId, name: newName})
  }

  const remove = async () => {
    if(confirm("permanently remove sheet and all data within?")) {
      await InterkitClient.call('sheet.remove', {sheetKey, projectId})
      close();
    }
  }

  const createColumn = ()=> {
    InterkitClient.call('sheet.addColumn', {sheetKey, projectId})
  }

  const createRow = ()=> {
    InterkitClient.call('sheet.addRow', {sheetKey, projectId})
  }

  const removeRow = (row)=> {
    if(confirm("permanently delete row?")) {
      InterkitClient.call('row.delete', {key: row.key, projectId})   
    }
  }
  
  // called when user clicks on a cell in the data table
  const updateValue = (row, cell) => {
    console.log(row)
    let column = headers.find(h => h.key == cell.key)
    let columnName = column?.value
    let columnType = column?.type
    console.log(columnType)

    if(columnType == "string") {
      let newVal = prompt("Update " + columnName, cell.value)
      if(newVal != null) {
        InterkitClient.call('row.updateValue', {rowKey: row.key, colKey: column.key, newVal, projectId})
      }
    }

    if(columnType == "number") {
      let newVal = prompt("Update " + columnName, (cell.value && typeof cell.value == "number") ? cell.value : "")
      newVal = parseFloat(newVal);
      if(newVal != null) {
        InterkitClient.call('row.updateValue', {rowKey: row.key, colKey: column.key, newVal, projectId})
      }
    }

    if(columnType == "location" || columnType == "sheetRef" || columnType == "mediaFile") {
      console.log("opening input modal", columnType)
      updateCell = cell;
      updateRow = row;
      inputModalValue = cell.value;
      openInputModal = columnType;
      if(columnType == "sheetRef") {
        // get key of sheet that is referenced in column
        let currentColumn = $currentSheet.columns.find(c=>c.key == updateCell.key)
        console.log(currentColumn)
        modalParams = {reference: currentColumn.reference}
      }
    }
  }

  // submits the value retrieved from the input modal to the database
  const submitValue = (value) => {
    console.log("submitting", value)
    InterkitClient.call('row.updateValue', {
      colKey: updateCell.key, 
      rowKey: updateRow.key, 
      newVal: value,
      projectId
    })
  }

  const openUpdateHeaderModal = (header) => {
    console.log(header)
    headerTypeModal = "columnType";
    updateHeader = header;
  }

  const moveCol = (header, direction) => {
    InterkitClient.call('sheet.moveColumn', {sheetKey, projectId, colKey: header.key, direction}) 
  }

  const deleteCol = (header) => {
    if(confirm("permanently delete column?"))
      InterkitClient.call('sheet.removeColumn', {sheetKey, projectId, colKey: header.key}) 
  }

  const submitHeaderColumnUpdate = () => {
    console.log("submit", updateHeader)
    InterkitClient.call('sheet.updateHeader', {sheetKey, projectId, colKey: updateHeader.key, newVal: updateHeader.value, newType: updateHeader.type, newReference: updateHeader.reference})
  }
  
  // transform headers and rows for use with carbon DataTable
  const sortFunction = (a, b) => {
    if (a < b || !a) return -1;
    if (a > b || !b) return 1;
    return 0;
  }

  let headers = []
  $: {
    if($currentSheet) 
      if($currentSheet.columns) 
        headers = $currentSheet.columns.map(c=>{return {
          key: c.key, 
          value: c.name, 
          type: c.type, 
          reference: c.reference,
          // allow sorting only on simple types - note that sort cannot be set to true, the component then expects a custom sorting function!
          sort: (c.type == "number" || c.type == "string") ? 
            sortFunction : false
        }}).concat({ 
          key: "overflow", 
          sort: false,
          //empty: true 
        }) // add overflow column
  }
  $: { console.log("rows update", $rows) }
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.values, key: r.key, id: r._id}}) : []
  $: { console.log("carbonRows update", carbonRows) }

</script>

{#if $currentSheet}
  <button on:click={close}>{"<<"} back</button><br><br>
  <h4>{$currentSheet.name} <small>{$currentSheet.key}</small> <button on:click={rename}>rename</button> <button on:click={remove}>remove</button></h4>
  

  <br><br>
  <DataTable
    sortable
    {headers}
    rows={carbonRows}
    style="min-height: 100px; padding-bottom: 100px; overflow-x: scroll"
  >
    
    <span slot="cell-header" let:header>
      {#if header.key == "overflow"}
        <OverflowMenu flipped>
            <OverflowMenuItem on:click={createColumn} text="add column" />    
        </OverflowMenu>   
      {:else}
        <div class="sheet-header" >
          <OverflowMenu size="sm">
            <div slot="menu" style="font-size: 1rem; padding: 5px;">{header.value}</div>
            <OverflowMenuItem on:click={()=>{openUpdateHeaderModal(header)}} text="edit" />
            <OverflowMenuItem on:click={()=>{moveCol(header, -1)}} text="move left" />
            <OverflowMenuItem on:click={()=>{moveCol(header, 1)}} text="move right" />
            <OverflowMenuItem on:click={()=>{deleteCol(header)}} text="remove" />
          </OverflowMenu>
        </div>
      {/if}
    </span>
    
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'overflow'}
        <OverflowMenu flipped>
          <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
        </OverflowMenu>
      {:else}
        <span class="sheet-cell" on:click={()=>{updateValue(row, cell)}}>
          <SheetCell {cell} {refData} {projectId}/>
        </span>
      {/if}
    </span>
  
  </DataTable>
  <button on:click={createRow}>add row</button>
{/if}
    
<InputModal
  type={headerTypeModal}
  bind:value={updateHeader}
  submit={submitHeaderColumnUpdate}  
  close={()=>{headerTypeModal = null}}
  {projectId}
/>

<InputModal
  type={openInputModal}
  bind:value={inputModalValue}
  submit={()=>submitValue(inputModalValue)}
  close={()=>{openInputModal = null}}
  {projectId}
  params={modalParams}
/>

<style>
  .sheet-header:hover {cursor: pointer}
  .header-type {font-weight: normal; margin-bottom: 5px;}
  .sheet-cell:hover {cursor: pointer}
  .sheet-cell {
    width: 100%;
    height: 1.5em;
    display: block;
  }
  .marker-icon { height: 30px; }
  small {
    font-size: 50%;
  } 
</style>