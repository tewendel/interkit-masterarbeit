<script>

  import { onMount } from 'svelte'

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  import { templates as staticTemplates } from '../Story/newNodeTemplates.js'

  export let submit
  export let close
  export let templateText
  export let nodeId
  export let editNodeId
  export let dynamicTemplates

  let templates = []
  export let selected

  $: templates = dynamicTemplates.concat(staticTemplates) // [ ...dynamicTemplates, ...staticTemplates ]

  $: templateText = selected

  onMount(() => {
    selected = selected || templates[0].value
  })

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
    <p>
      {#if editNodeId}
        The new node will be placed next to node <strong>{editNodeId}</strong>.
      {:else}
        Hint: when you have a node selected, the new node will be placed next to it.
      {/if}
    </p>
    <pre class="NewNodeModalPreview">{templateText}</pre>
  </ModalBody>
  <ModalFooter primaryButtonText="Create" secondaryButtonText="Cancel" />
</ComposedModal>

<style>
  .NewNodeModalPreview {
    border: 1px solid #444;
    padding: 1em;
    max-height: 10em;
    max-width: 100%;
    overflow: scroll;
  }
</style>
