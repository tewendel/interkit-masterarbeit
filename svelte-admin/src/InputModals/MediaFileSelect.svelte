<script>

  import { InterkitClient } from 'interkit'
  import MediaFileList from '../MediaFileList.svelte'

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

  let files = [];

  onMount(async ()=>{
    files = await InterkitClient.call("mediafiles.get", projectId)
  })

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody>
    <MediaFileList radio mediafiles={files} bind:value={value} {projectId}/>
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

<style>
  
</style>