<script>

import { InterkitClient } from 'interkit'

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

  let sheets;
  let columns;

  const updateColumns = () => {
    //console.log(value?.sheetId, sheets)
    let sheet = sheets.find(s=>s.key == value?.sheetKey)
    columns = sheet?.columns;
    console.log(sheet)

    if(value.sheetKey == "empty") value.text = "";
  }

  onMount(async ()=>{
    sheets = await InterkitClient.call("sheets.get", {projectId})         
    console.log("SheetColumnSelect mount with", sheets, value);
    updateColumns();
  })

  const updateHumanReadable = () => {
    console.log("updateHumanReadable", value)
    if(value.columnKey == "empty") {
      value.text = "";
    } else {
      value.text = 
        sheets.find(s=>s.key == value?.sheetKey)?.name + 
        "/" + 
        columns.find(c=>c.key == value?.columnKey)?.name;
      value.columnType = columns.find(c=>c.key == value?.columnKey)?.type;
    }
  }
  
</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Select Sheet and Column for {params?.notice}" />
  <ModalBody style="height: 200px">

    {#if sheets}
      <Select labelText="First pick a sheet, then the column" bind:selected={value.sheetKey} on:update={updateColumns}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each sheets as sheet}
            <SelectItem value={sheet.key} text={sheet.name} />
          {/each}
      </Select>
    {/if}

    {#if columns}
      <Select labelText="Columns" bind:selected={value.columnKey} on:update={updateHumanReadable}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each columns as column}
            <SelectItem value={column.key} text={column.name} />
          {/each}
      </Select>
    {/if}

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
    
</ComposedModal>


<style>
  
</style>