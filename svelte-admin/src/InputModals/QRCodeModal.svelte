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
    CopyButton,

    FormLabel

  } from "carbon-components-svelte";

  import QrCode from "svelte-qrcode"
  import { BundleServer } from '../BundleServer.js'
  import { onMount } from 'svelte'

  import { InterkitClient } from 'interkit'

  import { currentProjectReadOnly } from "../admin";

  export let open = false;
  export let value;
  export let params;
  export let projectId;
  
  export let submit;
  export let close;

  const setValue = (v) => {
    value = {
      type: "qrCode",
      qrCode: textInputValue
    }
  }

  let textInputValue = value?.qrCode
  if(!textInputValue) {
    textInputValue = value
    setValue(textInputValue)
  }
  console.log("textInputValue", textInputValue, value)
  let routePath;
  let publicBuildURL
  
  onMount(async () => {
    let bundleServerURL = BundleServer.getServerURL()
    publicBuildURL = projectId ? bundleServerURL + "/app/" + projectId + "/" : null
  })

  const toggleRowKey = () => {
    textInputValue = params.rowKey
    setValue(textInputValue)
    if(confirm("update all rows to use the row key? (warning: this will overwrite the qr codes in all rows)")) {
      updateAllRows("rowKey")
    }
  }

  const toggleRoute = () => {
    if(!routePath) {
      alert("please specificy a route path first")
      return false
    }
    textInputValue = `${publicBuildURL}#/${routePath}/` + params.rowKey
    setValue(textInputValue)
    if(confirm("update all rows to use a URL in the same way? (warning: this will overwrite the qr codes in all rows)")) {
      updateAllRows("url")
    }
  }

  const textInputChange = () => {
    console.log("textInputChange", textInputValue)
    setValue(textInputValue)
  }
  const textInputKeyUp = () => {
    console.log("textInputKeyDown", textInputValue)
    setValue(textInputValue)
  }

  const updateAllRows = async (mode) => {
    
    let rows = await InterkitClient.call('sheet.getRows', {
      sheetKey: params.sheetKey,
      projectId
    })
    console.log("all rows", rows)

    for(let row of rows) {

      let code
      if(mode == "rowKey") code = row.key
      if(mode == "url") code = `${publicBuildURL}#/${routePath}/` + row.key
      let valObj = {
        type: "qrCode",
        qrCode: code
      }

      console.log("updating", row.key, params.currentColumn.key, code)
      InterkitClient.call('row.updateValue', {
        colKey: params.currentColumn.key, 
        rowKey: row.key, 
        newVal: valObj,
        projectId
      })
    }
    
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

    <TextInput size="small" placeholder="Enter QR-Code value..." bind:value={textInputValue} on:keyup={textInputKeyUp} on:change={textInputChange}/>
    

    <br>
    <Button size="small" kind="tertiary" on:click={toggleRowKey}>use row key</Button>

    <br><br>
    
    <Button size="small" kind="tertiary" on:click={toggleRoute}>use public dataRouteSingle URL</Button>
    <br><br>
    
    <TextInput size="small" placeholder="route path (e.g. elements)..." bind:value={routePath}/>
    
    

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>


