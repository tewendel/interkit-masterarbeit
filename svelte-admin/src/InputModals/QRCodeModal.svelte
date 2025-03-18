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
    CopyButton
  } from "carbon-components-svelte";

  import QrCode from "svelte-qrcode"

  import { currentProjectReadOnly } from "../admin";

  export let open = false;
  export let value;
  export let params;
  
  export let submit;
  export let close;

  let useRowKey = false;
  let valueBackup = value;
  let textInputValue = value?.qrCode

  const toggleRowKey = () => {
    if(useRowKey) {
      valueBackup = value?.qrCode
      textInputValue = params.rowKey
      setValue(params.rowKey)
    } else {
      textInputValue = valueBackup
      setValue(valueBackup)
    }
  }

  const setValue = (v) => {
    value = {
      type: "qrCode",
      qrCode: textInputValue
    }
  }

  const textInputChange = () => {
    setValue(textInputValue)
  }

  
</script>

<ComposedModal open
  on:submit={()=>{open = false; submit()}}
  on:close={close}
  >
  <ModalBody>

    <div style="height:320px; margin-top:10px;">
      {#if value?.qrCode}
        <QrCode
            value={value?.qrCode}
            padding={15}
            size={300}
          />  
      {/if}
    </div>

    <CopyButton text={value?.qrCode} />

    <TextInput size="small" placeholder="Enter QR-Code value..." bind:value={textInputValue} on:change={textInputChange}/>
    

    <br>

    <Toggle
      size="sm"
      labelText="use row key"
      bind:toggled={useRowKey}
      on:toggle={toggleRowKey}
    />

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>


