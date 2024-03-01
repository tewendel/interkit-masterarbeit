<script>

import { InterkitClient, util } from 'interkit'

import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem,
    MultiSelect
  } from "carbon-components-svelte";

  import { onMount, onDestroy } from 'svelte'
  import { currentProjectReadOnly } from '../admin.js'

  export let value = {};
  export let submit;
  export let close;
  export let projectId
  export let params;

  let sheet;
  let labelColumnKey;
  let rows;

  onMount(async ()=>{
    console.log("mount sheetrefselect", params)
    if(params?.reference) {
      sheet = await InterkitClient.call("sheet.get", {key: params.reference, projectId})
      labelColumnKey = util.firstTextColKey(sheet);
      console.log("labelColumnKey", labelColumnKey)
      if(!labelColumnKey) console.log("warning: no text column in sheet")

      rows = await InterkitClient.call("rows.get", {sheetKey: params.reference, projectId})        
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

  // saving the row keys in the id field for Carbon multiselect
  $: multiSelectItems = rows ? rows.map(r=>{return {
    id: r.key, 
    text: String((labelColumnKey ? (r.values[labelColumnKey] ? r.values[labelColumnKey] : "") : r.key))
  }}) : []

  $: console.log("multiSelectItems", multiSelectItems, selectedIds)

  let selectedIds = value.rowKeys;
  const multiChange = ()=>{
    console.log(selectedIds)
    value = {
      type: "sheetRef",
      sheetKey: sheet.key, 
      columnKey: labelColumnKey,
      rowKeys: selectedIds // writing the selected keys back to rowKeys
    }
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Multiselect" />
  <ModalBody style="height: 300px">

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
        style="height: 200px"
      />

    {/if}
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
    
</ComposedModal>


<style>
  
</style>