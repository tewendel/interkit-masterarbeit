<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  export let submit
  export let close
  export let templateText
  export let nodeId

  const templates = [
    {
      label: 'aaa',
      value: 'Aaaa.'
    },
    {
      label: 'bbbb',
      value: 'Bbbb.'
    },
    {
      label: 'cccc',
      value: 'Cccccc.'
    }
  ]

  let selected = templates[0].value

  $: {
    templateText = selected
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader title="Create new node" />
  <ModalBody hasForm>
    <TextInput bind:value={nodeId} inline light labelText="Node name" />
    <FormGroup>
      <Select labelText="Option" bind:selected={selected}>
        {#each templates as template}
          <SelectItem value={template.value} text={template.label} />
        {/each}
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Create" secondaryButtonText="Cancel" />
</ComposedModal>
