<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    FormGroup
  } from "carbon-components-svelte"

  export let open
  export let value = {}
  export let submit
  export let close

</script>

<ComposedModal
  {open}
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader label={`Sheet \"${value.key}\" (id ${value.id})`} title="Rename Sheet" />
  <ModalBody hasForm>
    <FormGroup>
      <TextInput labelText="Name" placeholder="Enter sheet name..." bind:value={value.newName} />
    </FormGroup>
    <FormGroup>
      <span>
        WARNING: only change if you know what you are doing.<br/>
        Must not be empty, must not collide with another sheet.
      </span>
      <TextInput labelText="Key" placeholder="Enter sheet key..." bind:value={value.newKey} />
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>
