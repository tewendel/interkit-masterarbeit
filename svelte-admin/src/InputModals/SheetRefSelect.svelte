<script>

import { InterkitClient } from 'interkit-shared'

import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem
  } from "carbon-components-svelte";

  import { onMount, onDestroy } from 'svelte'

  export let value = {};
  export let submit;
  export let close;
  export let projectId
  export let params;

  let sheet;
  let rows;

  onMount(async ()=>{
    console.log("mount sheetrefselect", params)
    if(params?.reference) {
      sheet = await InterkitClient.call("sheet.get", params.reference)         
      rows = await InterkitClient.call("rows.get", params.reference)        
      console.log(sheet, rows);
    }
  })

  let selectedRowId = value?.rowId;
  console.log(selectedRowId)

  const change = ()=> {
    let row = rows.filter(r => r._id == selectedRowId)[0]
    if(!row) {
      row = rows[0];
      selectedRowId = row._id;
    }
    value = {rowId: selectedRowId, name: row?.value[sheet?.columns?.[0]?.key]}
    console.log("change", value)
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Select a row" />
  <ModalBody>

    {#if rows && sheet.columns}
      <Select labelText="Rows" bind:selected={selectedRowId} on:change={change}>
          {#each rows as row}
            <SelectItem value={row._id} text={row.value[sheet.columns[0].key]} />
            }
          {/each}
      </Select>
    {/if}
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
    
</ComposedModal>


<style>
  
</style>