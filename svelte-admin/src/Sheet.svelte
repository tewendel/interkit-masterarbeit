<script>
  import { InterkitClient } from 'interkit-shared'
  import { DataTable } from "carbon-components-svelte";
  import InputModal from './InputModals/InputModal.svelte';
  import { columnTypes } from './baseConfig.js';

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
    if(rowsSubHandle) rowsSubHandle.stop()
    if(newId) {
      rowsSubHandle = await InterkitClient.getSub('rows', 'rows', [newId], (r)=>r.sheetId == newId);
      rows = rowsSubHandle.data;

      currentSheetSub = await InterkitClient.getSub('sheets', 'sheets', [projectId], (s)=>s.id == id, true);
      currentSheet = currentSheetSub.data;
    }
  }

  // update the row subscriptions when id prop changes
  $: setup(id)
  
  const createColumn = ()=> {
    InterkitClient.call('sheet.addColumn', {sheetId: id})
  }

  const createRow = ()=> {
    InterkitClient.call('sheet.addRow', {sheetId: id})
  }
  
  // called when user clicks on a cell in the data table
  const updateValue = (row, cell) => {
    let column = headers.filter(h => h.key == cell.key)?.[0]
    let columnName = column?.value
    let columnType = column?.type
    console.log(columnType)

    if(columnType == "string") {
      let newVal = prompt("Update " + columnName, cell.value)
      if(newVal != null) {
        InterkitClient.call('sheet.updateValue', {key: cell.key, rowId: row.id, newVal})
      }
    }

    if(columnType == "location" || columnType == "sheetRef") {
      console.log("opening input modal", columnType)
      updateCell = cell;
      updateRow = row;
      inputModalValue = cell.value;
      openInputModal = columnType;
      if(columnType == "sheetRef") {
        // get id of sheet that is referenced in column
        let currentColumn = $currentSheet.columns.filter(c=>c.key == updateCell.key)?.[0]
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
  
  let headers = []
  $: {
    if($currentSheet) 
      if($currentSheet.columns) 
        headers = $currentSheet.columns.map(c=>{return {key: c.key, value: c.name, type: c.type, reference: c.reference}})
  }
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.value, id: r.id}}) : []

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <small>{$currentSheet.id}</small> <button on:click={rename}>rename</button> <button on:click={remove}>remove</button> <button on:click={close}>close</button></h4>
  
  <DataTable
    {headers}
    rows={carbonRows}
  >
    <span slot="cell-header" let:header>
      <div class="sheet-header" on:click={()=>{openUpdateHeaderModal(header)}}>
        <span>{header.value}</span>
        <span class="header-type">({header.type})</span>
      </div>
    </span>
    <span slot="cell" let:row let:cell>
      <span class="sheet-cell" on:click={()=>{updateValue(row, cell)}}>
        {#if cell.value?.lat}
          <img class="marker-icon" src="leaflet/marker-icon.png"/>
        {:else if cell.value?.name}
          {cell.value.name}  
        {:else}
          {cell.value}
        {/if}
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
  .marker-icon { height: 30px; }

  small {
    font-size: 50%;
  }
    
</style>