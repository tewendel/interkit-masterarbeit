<script>

import { InterkitClient } from 'interkit-shared'

import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem,
    MultiSelect
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

  /*let selectedRowId = value?.rowId;
  console.log(selectedRowId)

  const change = ()=> {
    let row = rows.find(r => r._id == selectedRowId)
    if(selectedRowId == "empty" || !row) {
      value = null
      selectedRowId = "empty"
    } else {
      value = {rowId: selectedRowId, sheetId: sheet._id, columnKey: sheet.columns[0].key}
    }
    console.log("change", value)
  }*/

  $: multiSelectItems = rows ? rows.map(r=>{return {id: r._id, text: r.value[sheet.columns[0].key]}}) : []

  let selectedIds = value.rowIds;
  const multiChange = ()=>{
    console.log(selectedIds)
    value = {
      type: "sheetRef",
      sheetId: sheet._id, 
      columnKey: sheet.columns[0].key,
      rowIds: selectedIds
    }
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Multiselect" />
  <ModalBody style="height: 200px">

    {#if rows && sheet.columns}
      <!--Select labelText="Rows" bind:selected={selectedRowId} on:change={change}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each rows as row}
            <SelectItem value={row._id} text={row.value[sheet.columns[0].key]} />
            }
          {/each}
      </Select-->

      <MultiSelect
        titleText="Rows"
        label="Select Rows..."
        items={multiSelectItems}
        bind:selectedIds={selectedIds}
        on:select={multiChange}
      />

    {/if}
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
    
</ComposedModal>


<style>
  
</style>