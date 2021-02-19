<script>
  import { InterkitClient } from 'interkit-shared'
  import { DataTable } from "carbon-components-svelte";
  import LocationPicker from './LocationPicker.svelte';

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup

  } from "carbon-components-svelte";

  export let id;
  export let projectId;
  export let close;

  let composeModalOpen = false;
  let updateHeader = {}

  let openLocationPicker = false;
  let updateRow;
  let updateCell;
  let updateLatLng;

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

    if(columnType == "location") {
      console.log("opening location picker", cell)
      updateCell = cell;
      updateRow = row;
      updateLatLng = cell.value;
      openLocationPicker = true;
    }
  }

  const submitLatLng = () => {
    let newVal = updateLatLng;
    InterkitClient.call('sheet.updateValue', {key: updateCell.key, rowId: updateRow.id, newVal})
  }

  const openUpdateHeaderModal = (header) => {
    composeModalOpen = true;
    updateHeader = header;
  }

  const submitHeaderColumnUpdate = () => {
    console.log("submit", updateHeader)
    InterkitClient.call('sheet.updateHeader', {sheetId: id, key: updateHeader.key, newVal: updateHeader.value, newType: updateHeader.type})
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
        headers = $currentSheet.columns.map(c=>{return {key: c.key, value: c.name, type: c.type}})
  }
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.value, id: r.id}}) : []

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <button on:click={rename}>rename</button> <button on:click={remove}>remove</button> <button on:click={close}>close</button></h4>
  
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
        {#if cell.value.lat}
          <img class="marker-icon" src="leaflet/marker-icon.png"/>
        {:else}
          {cell.value}
        {/if}
      </span>
    </span>
  </DataTable>

  <button on:click={createRow}>add row</button>
  <button on:click={createColumn}>add column</button>
{/if}

<ComposedModal open={composeModalOpen}
  on:submit={()=>{composeModalOpen = false; submitHeaderColumnUpdate();}}
  on:close={()=>composeModalOpen = false}
  >
  <ModalHeader title="Update Column" />
  <ModalBody hasForm>
    <FormGroup>
      <TextInput data-modal-primary-focus labelText="Name" placeholder="Enter column name..." bind:value={updateHeader.value} />
    </FormGroup>
    <FormGroup>
      <Select labelText="Type" bind:selected={updateHeader.type}>
        <SelectItem value="string" text="String" />
        <SelectItem value="location" text="Location" />
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

<LocationPicker 
  bind:open={openLocationPicker} 
  bind:latlng={updateLatLng}
  submit={submitLatLng}
/>

<style>
  .sheet-header:hover {cursor: pointer}
  .header-type {font-weight: normal; margin-bottom: 5px;}
  .sheet-cell:hover {cursor: pointer}
  .marker-icon { height: 30px; }
    
</style>