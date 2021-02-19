<script>
  import { InterkitClient } from 'interkit-shared'

  import { DataTable } from "carbon-components-svelte";

  export let id;
  export let projectId;
  export let close;

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

  const updateHeader = (header) => {
    console.log(header);
    let newVal = prompt("Update column name");
    InterkitClient.call('sheet.updateHeader', {sheetId: id, key: header.key, newVal})
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
  
  $: headers = $currentSheet ? $currentSheet?.columns.map(c=>{return {key: c.key, value: c.name}}) : []
  $: carbonRows = $rows ? $rows.map(r=>{return {...r.value, id: r.id}}) : []


</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <button on:click={rename}>rename</button> <button on:click={remove}>remove</button><button on:click={close}>close</button></h4>
  
  <DataTable
    {headers}
    rows={carbonRows}
  >
    <span slot="cell-header" let:header>
      <span on:click={()=>{updateHeader(header)}}>{header.value}</span>
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

<style>
  .sheet-cell:hover {cursor: pointer}
</style>