<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  export let value = {};
  export let submit;
  export let close;
  export let projectId;
  export let params;

  let options = ['contain', 'cover', 'none', 'passepartout']

  // if value was just instantiated set it to first option
  if(typeof value == "object" && options.length) value = options[0]

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Object Fit" />
  <ModalBody hasForm>
    <FormGroup>
      <Select labelText="Option" bind:selected={value}>
        {#each options as option}
          <SelectItem value={option} text={option} />
        {/each}
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>

<style>
  
</style>
