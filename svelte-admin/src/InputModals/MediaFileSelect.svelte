<script>

  import { InterkitClient } from 'interkit'
  import MediaFileList from '../Media/MediaFileList.svelte'

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

  import { currentProjectReadOnly } from '../admin';

  export let value = {};
  export let submit;
  export let close;
  export let projectId;
  export let params;

  let files = [];

  onMount(async ()=>{
    files = await InterkitClient.call("mediafiles.get", {projectId})
  })
  
  const onSelect = (select) => {
    console.log("onSelect", select.detail)
    value = select.detail
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody>
    <MediaFileList 
      radio 
      mediafiles={files} 
      {value} 
      {projectId}
      on:selected={onSelect}
    />
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>

<style>
  
</style>