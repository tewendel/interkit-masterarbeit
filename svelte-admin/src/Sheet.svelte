<script>
  import { InterkitClient } from 'interkit-shared'

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

  const updateValue = (col, row) => {
    let newVal = prompt("Update " + col.name, row.value[col.name])
    InterkitClient.call('sheet.updateValue', {col, row, newVal})
  }

  const rename = () => {
    let newName = prompt("Rename sheet", $currentSheet.name)
    InterkitClient.call('sheet.rename', {sheetId: id, name: newName})
  }

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} <small>{$currentSheet.id}</small> <button on:click={rename}>rename</button> <button on:click={close}>close</button></h4>
  
  <table>
  
  {#if $currentSheet.columns}
  <tr>
    {#each $currentSheet.columns as col}
      <th>{col.name}</th>
    {/each}      
    <th><button on:click={createColumn}>+</button></th>
  </tr>    
  {/if}
  
  {#if $rows}
    <!-- we need to use $projects here to get the reactive value of the store -->
    {#each $rows as row}
    <tr>
      {#each $currentSheet.columns as col}
        <td class="sheet-cell" on:click={()=>{updateValue(col, row)}}>{row.value[col.name]}</td>
      {/each}      
    </tr>
    {/each}
    <button on:click={createRow}>+</button>
  {:else}
    loading...
  {/if}

  </table>

{/if}

<style>
  .sheet-cell:hover {cursor: pointer}
  small {
    font-weight: normal;
  }
</style>