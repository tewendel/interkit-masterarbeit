<script>
  import { Sheets, Rows } from '../imports/collections.js';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  export let id;

  let rowsSubHandle;
  let rows;

  const setup = (newId) => {
    if(rowsSubHandle) rowsSubHandle.stop()
    if(newId) {
      rowsSubHandle = Meteor.subscribe('rows', newId);
      rows = Rows.find({sheetId: newId})
    }
  }

  // the $: makes this svelte reactive to changing the id prop
  // the useTracker makes it meteor reactive to changes in the document
  // useTracker returns a svelte store, so to get the value we need to use $currentSheet below
  $: currentSheet = useTracker(() => Sheets.findOne(id));

  // update the row subscriptions when id prop changes
  $: setup(id)
  
  const createColumn = ()=> {
    Meteor.call('sheet.addColumn', {sheetId: id})
  }

  const createRow = ()=> {
    Meteor.call('sheet.addRow', {sheetId: id})
  }

  const updateValue = (col, row) => {
    let newVal = prompt("Update " + col.name, row.value[col.name])
    Meteor.call('sheet.updateValue', {col, row, newVal})
  }

</script>

{#if $currentSheet}
  <h4>{$currentSheet.name} {id}</h4>
  
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
</style>