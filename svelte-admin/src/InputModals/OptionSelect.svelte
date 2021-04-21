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

  import { onMount } from 'svelte'

  export let value = {};
  export let submit;
  export let close;
  export let projectId;
  export let params;

  let options = params.currentColumn.options.split(",").map(o => o.trim())

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody hasForm>
    <FormGroup>
      <Select labelText="Option" bind:selected={value}>
        {#each options as option}
          <SelectItem value={option} text={option} />
        {/each}
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

<style>
  
</style>