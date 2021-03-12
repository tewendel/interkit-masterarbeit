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
  
  onMount(async ()=>{
    sheets = await InterkitClient.call("sheets.get", projectId)         
    console.log(sheets);
  })

  let columns;

  const updateColumns = () => {
    console.log(value?.sheetId, sheets)
    let sheet = sheets.find(s=>s._id == value?.sheetId)
    columns = sheet?.columns;
    console.log(sheet)
  }
  
</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Select" />
  <ModalBody style="height: 200px">

    {#if sheets}
      <Select labelText="Sheets" bind:selected={value.sheetId} on:change={updateColumns}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each sheets as sheet}
            <SelectItem value={sheet._id} text={sheet.name} />
          {/each}
      </Select>
    {/if}

    {#if columns}
      <Select labelText="Columns" bind:selected={value.columnKey}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each columns as column}
            <SelectItem value={column.key} text={column.name} />
          {/each}
      </Select>
    {/if}
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
    
</ComposedModal>


<style>
  
</style>