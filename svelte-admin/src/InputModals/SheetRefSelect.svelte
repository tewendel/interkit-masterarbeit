<script>

import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "carbon-components-svelte";

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
  <ModalHeader title="Select" />
  <ModalBody>

     
    
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>


<style>
  
</style>