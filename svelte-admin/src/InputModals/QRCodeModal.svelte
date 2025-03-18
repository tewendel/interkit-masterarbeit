<script>

import {
    Button,
    ComposedModal,
    CodeSnippet,
    FormGroup,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Toggle,
  } from "carbon-components-svelte";

  import QrCode from "svelte-qrcode"

  import { currentProjectReadOnly } from "../admin";

  export let open = false;
  export let value;
  
  export let submit;
  export let close;

  let useRowKey = false;
  let valueBackup = value;

  const toggleRowKey = () => {
    if(useRowKey) {
      valueBackup = value
      value = "rowkey"
    } else {
      value = valueBackup
    }
  }
  
</script>

<ComposedModal open
  on:submit={()=>{open = false; submit()}}
  on:close={close}
  >
  <ModalBody>

    <div style="height:220px; margin-top:10px;">
      {#if value}
        <QrCode
            value={value}
            padding={15}
          />  
      {/if}
    </div>

    <TextInput size="small" placeholder="Enter QR-Code value..." bind:value={value} />

    <!--br>

    <Toggle
      size="sm"
      labelText="use row key"
      bind:toggled={useRowKey}
      on:toggle={toggleRowKey}
    /-->

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>


