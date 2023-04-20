<script>

  import { onMount, createEventDispatcher } from 'svelte'

  import { InterkitClient } from 'interkit'

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte"

  import MediaFileList from '../MediaFileList.svelte'
  import MediaUpload from '../MediaUpload.svelte'

  export let projectId

  export let open

  export let name
  export let channel
  let title = ''
  let label = ''
  let image = ''

  const dispatch = createEventDispatcher()

  let updateMediaFileListSelected
  let mediafiles = []

  // this could also be a subscription instead of on:success...
  const updateMediaFiles = async () => {
    mediafiles = await InterkitClient.call("mediafiles.get", {projectId})
  }

  const prefill = async () => {
    title = channel?.title || ''
    label = channel?.label || ''
    await updateMediaFiles()
    // imageIn = channel?.image || ''
    updateMediaFileListSelected(channel?.image)
  }

</script>

<ComposedModal
  {open}
  on:submit={() => dispatch('submit', { name, title, label, image })}
  on:close={() => { open = false; dispatch('close') }}
  on:open={() => prefill()}
>
  <ModalHeader title="Edit board" />
  <ModalBody hasForm>
    <TextInput bind:value={name} light labelText="Board name" />
    <TextInput bind:value={title} light labelText="Board title" />
    <TextInput bind:value={label} light labelText="Board label" />
    <TextInput value={JSON.stringify(image)} light labelText="Board image" />
    <h3>Preview Image</h3>
    <MediaUpload
      {projectId}
      on:success={() => updateMediaFiles() }
      />
    <MediaFileList
      {projectId}
      radio
      {mediafiles}
      sortKey="createdAt"
      sortDirection="descending"
      pageSize={5}
      value={image}
      bind:update={updateMediaFileListSelected}
      on:selected={({ detail }) => { image = detail }}
      />
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>
