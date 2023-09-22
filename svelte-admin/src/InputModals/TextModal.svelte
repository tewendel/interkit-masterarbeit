<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    TextArea
  } from "carbon-components-svelte"

  import { currentProjectReadOnly } from "../admin";

  export let value = ''
  export let submit
  export let close

  

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader title="Text" />
  <ModalBody hasForm>
    <FormGroup>
      <TextArea bind:value={value} />
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>
