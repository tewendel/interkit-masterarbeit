<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "carbon-components-svelte";
  import SheetIdSelectForm from "./SheetIdSelectForm.svelte";

  export let value = {};
  export let submit;
  export let close;
  export let params;
  export let projectId; // unused
  
</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
  >
  <ModalHeader title="Select Sheet for {params?.notice}" />
  <ModalBody style="height: 200px">

    <SheetIdSelectForm value={value} on:update={(e)=>{value = e.detail}}/>          
     
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
    
</ComposedModal>


<style>
  
</style>