<script>
  import { InterkitClient } from 'interkit'
  import { DataTable } from "carbon-components-svelte";
  import InputModal from './InputModals/InputModal.svelte';
  import SheetCell from './SheetCell.svelte';
  import { columnTypes } from './baseConfig.js';
  import { onDestroy } from 'svelte';

  export let id;
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

  const setup = async (newId) => {
    if(newId) {
      // subscribe to the rows of the current sheet
      if(rowsSubHandle) rowsSubHandle.stop()
      rowsSubHandle = await InterkitClient.getSub('rows', 'rows', [newId], (r)=>r.sheetId == newId);
      rows = rowsSubHandle.data;

      // subscribe to the current sheet itself
      if(currentSheetSub) currentSheetSub.stop()
      currentSheetSub = await InterkitClient.getSub('sheets', 'sheets', [projectId], (s)=>s.id == id, true);
      currentSheet = currentSheetSub.data;      
    }
  }

  // initialize the row subscriptions when id prop changes
  $: setup(id)

  let refSubs = {};
  let refData = {};
  let refDataUnsubscribe = {};
  
  // setup subscriptions for other sheets referenced in columns
  const updateReferenceSubscriptions = async (sheet) => {
    if(sheet) {
      for(let column of sheet.columns.filter(c=>c.type == "sheetRef")) {
        let refSheetId = column.reference

        if(refSubs[refSheetId]) refSubs[refSheetId].stop()
        refSubs[refSheetId] = await InterkitClient.getSub('rows', 'rows', [refSheetId], (r)=>r.sheetId == refSheetId);
        
        // manually (un)subscribe to the store to update data
        if(refDataUnsubscribe[refSheetId]) refDataUnsubscribe[refSheetId]()
        
        refDataUnsubscribe[refSheetId] = refSubs[refSheetId].data.subscribe(data => {
          //console.log("ref data Update")
          refData[refSheetId] = data;
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
    InterkitClient.call('sheet.rename', {sheetId: id, name: newName})
  }

  const remove = async () => {
    if(confirm("permanently remove sheet and all data within?")) {
      await InterkitClient.call('sheet.remove', {sheetId: id})
      close();
    }
  }

  const createColumn = ()=> {
    InterkitClient.call('sheet.addColumn', {sheetId: id})
  }

  const createRow = ()=> {
    InterkitClient.call('sheet.addRow', {sheetId: id})
  }
  
  // called when user clicks on a cell in the data table
  const updateValue = (row, cell) => {
    let column = headers.find(h => h.key == cell.key)
    let columnName = column?.value
    let columnType = column?.type
    console.log(columnType)

    if(columnType == "string") {
      let newVal = prompt("Update " + columnName, cell.value)
      if(newVal != null) {
        InterkitClient.call('sheet.updateValue', {key: cell.key, rowId: row.id, newVal})
      }
    }

    if(columnType == "number") {
      let newVal = prompt("Update " + columnName, (cell.value && typeof cell.value == "number") ? cell.value : "")
      newVal = parseFloat(newVal);
      if(newVal != null) {
        InterkitClient.call('sheet.updateValue', {key: cell.key, rowId: row.id, newVal})
      }
    }

    if(columnType == "location" || columnType == "sheetRef" || columnType == "mediaFile") {
      console.log("opening input modal", columnType)
      updateCell = cell;
      updateRow = row;
      inputModalValue = cell.value;
      openInputModal = columnType;
      if(columnType == "sheetRef") {
        // get id of sheet that is referenced in column
        let currentColumn = $currentSheet.columns.find(c=>c.key == updateCell.key)
        modalParams = {reference: currentColumn.reference}
      }
    }
  }

  // submits the value retrieved from the input modal to the database
  const submitValue = (value) => {
    console.log("submitting", value)
    InterkitClient.call('sheet.updateValue', {
      key: updateCell.key, 
      rowId: updateRow.id, 
      newVal: value
    })
  }

  const openUpdateHeaderModal = (header) => {
    headerTypeModal = "columnType";
    updateHeader = header;
  }

  const submitHeaderColumnUpdate = () => {
    console.log("submit", updateHeader)
    InterkitClient.call('sheet.updateHeader', {sheetId: id, key: updateHeader.key, newVal: updateHeader.value, newType: updateHeader.type, newReference: updateHeader.reference})
  }
  
  // transform headers and rows for use with carbon DataTable
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
          sort: !(c.type == "number" || c.type == "string") ? false : undefined  
        }})
  }
  $: { console.log("rows update", $rows) }
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.value, id: r.id}}) : []
  $: { console.log("carbonRows update", carbonRows) }

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <small>{$currentSheet.id}</small> <button on:click={rename}>rename</button> <button on:click={remove}>remove</button> <button on:click={close}>close</button></h4>
  
  <DataTable
    sortable
    {headers}
    rows={carbonRows}
    style="overflow-x: scroll"
  >
    
    <span slot="cell-header" let:header>
      <div class="sheet-header" on:click={()=>{openUpdateHeaderModal(header)}}>
        <span>{header.value}</span>
        <span class="header-type">({header.type})</span>
      </div>
    </span>
    
    <span slot="cell" let:row let:cell>
      <span class="sheet-cell" on:click={()=>{updateValue(row, cell)}}>
        <SheetCell {cell} {refData}/>
      </span>
    </span>
  
  </DataTable>
  <button on:click={createRow}>add row</button>
  <button on:click={createColumn}>add column</button>
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