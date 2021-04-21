<script>

  import { InterkitClient } from 'interkit'

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  import { columnTypes } from '../baseConfig.js';

  import { onMount } from 'svelte'

  export let value = {};
  export let submit;
  export let close;
  export let projectId;
  export let params;

  let sheets;

  onMount(async ()=>{
    sheets = await InterkitClient.call("sheets.get", projectId)
  })

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody hasForm>
    <FormGroup>
      <TextInput labelText="Name" placeholder="Enter column name..." bind:value={value.value} />
    </FormGroup>
    <FormGroup>
      <Select labelText="Type" bind:selected={value.type}>
        {#each Object.keys(columnTypes) as key}
          <SelectItem value={key} text={columnTypes[key]} />
        {/each}
      </Select>
    </FormGroup>
    {#if value.type == "sheetRef" && sheets}
      <FormGroup>
        <Select labelText="Sheet" bind:selected={value.reference}>
          <SelectItem value={undefined} text={"nicht zugeordnet"} />
          {#each sheets as sheet}
            <SelectItem value={sheet.key} text={sheet.name} />
          {/each}
        </Select>
      </FormGroup>
    {/if}
    {#if value.type == "optionSelect" && sheets}
      <FormGroup>
        <TextInput labelText="Options" placeholder="Option 1, Option 2" bind:value={value.options} />
      </FormGroup>
    {/if}
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

<style>
  
</style>