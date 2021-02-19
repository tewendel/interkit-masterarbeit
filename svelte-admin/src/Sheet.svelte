<script>
  import { InterkitClient } from 'interkit-shared'

  import { DataTable } from "carbon-components-svelte";

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

  export let composeModalOpen = false;

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
    let columnName = headers.filter(h => h.key == cell.key)?.[0]?.value
    let newVal = prompt("Update " + columnName, cell.value)
    InterkitClient.call('sheet.updateValue', {key: cell.key, rowId: row.id, newVal})
  }

  let updateHeader = {}
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
  
  $: headers = $currentSheet ? $currentSheet?.columns.map(c=>{return {key: c.key, value: c.name, type: c.type}}) : []
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.value, id: r.id}}) : []

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <button on:click={rename}>rename</button> <button on:click={remove}>remove</button><button on:click={close}>close</button></h4>
  
  <DataTable
    {headers}
    rows={carbonRows}
  >
    <span slot="cell-header" let:header>
      <span class="sheet-header" on:click={()=>{openUpdateHeaderModal(header)}}>{header.value}</span>
    </span>
    <span slot="cell" let:row let:cell>
      <span class="sheet-cell" on:click={()=>{updateValue(row, cell)}}>
        {cell.value}
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
  <ModalHeader label="Column" title="Update" />
  <ModalBody hasForm>
    <FormGroup>
      <TextInput labelText="Name" placeholder="Enter column name..." bind:value={updateHeader.value} />
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


<style>
  .sheet-cell:hover {cursor: pointer}
  .sheet-header:hover {cursor: pointer}
</style>