<script>

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

  onMount(()=>{
    console.log("mount sheetrefselect")
  
  })

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody hasForm>
    <FormGroup>
      <TextInput data-modal-primary-focus labelText="Name" placeholder="Enter column name..." bind:value={value.value} />
    </FormGroup>
    <FormGroup>
      <Select labelText="Type" bind:selected={value.type}>
        {#each Object.keys(columnTypes) as key}
          <SelectItem value={key} text={columnTypes[key]} />
        {/each}
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

<style>
  
</style>