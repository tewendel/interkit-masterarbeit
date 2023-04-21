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
    sheets = await InterkitClient.call("sheets.get", {projectId})         
    console.log(sheets);
  })

  const updateHumanReadable = () => {
    console.log(value)
    value.text = 
      sheets.find(s=>s.key == value.sheetKey)?.name
  }
  
</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Select Sheet for {params?.notice}" />
  <ModalBody style="height: 200px">

    {#if sheets}
      <Select labelText="Pick a sheet" bind:selected={value.sheetKey} on:update={updateHumanReadable}>
          <SelectItem value="empty" text="nicht zugeordnet" />
          {#each sheets as sheet}
            <SelectItem value={sheet.key} text={sheet.name} />
          {/each}
      </Select>
    {/if}
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
    
</ComposedModal>


<style>
  
</style>