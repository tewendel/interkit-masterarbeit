<script>
  import YAML from "yaml"
  import ConfigForm from './ConfigForm.svelte'; 
  import InterkitClient from '../../shared/interkit-client.js'
  import { BundleServer } from './BundleServer.js'


  export let file = null;
  export let config = false;
  export let projectId;

  export let shared = null;
  export let updateShared = ()=>true;

  let currentFile;
  let loadedContent;
  let configObj = null;
  
  $: setup(file)

  // reload if shared file content changes
  $: if(shared && loadedContent && shared != loadedContent) openFile(currentFile.filename)
  
  const setup = async (file) => {
    await openFile(file)  
  }
  
  const openFile = async (filename) => {
    console.log("open file", filename)
    currentFile = await InterkitClient.call("file.load", {filename, projectId})  
    
    // file wasn't found
    if(currentFile.error?.code == "ENOENT") {
      currentFile.content = ""
    }

    loadedContent = currentFile.content;

    if(filename.includes(".yml") && config) {
      initConfig(currentFile.content) 
    } else {
      configObj = null;
    }
  }

  const initConfig = (fileContent) => {
    try {
      console.log(fileContent)
      configObj = YAML.parse(fileContent)  
    } 
    catch(e) {
      console.log(e)
    }
      
    console.log(configObj)
  }

  const configUpdate = (newConfig) => {
    currentFile.content = YAML.stringify(newConfig)
    saveFile();
  }

  const saveFile = async () => {
    await InterkitClient.call("file.save", {file: currentFile, projectId})
    if(configObj) {
      initConfig(currentFile.content)
    }
    updateShared(currentFile.content);
    BundleServer.compileReloadPreview();
  }


  
</script>

{#if currentFile}

  {#if configObj}
    <ConfigForm {configObj} {configUpdate}/>
  {:else}  
      <textarea bind:value={currentFile.content}></textarea><br>
      <button on:click={saveFile}>save</button>
  {/if}
  <small>{currentFile.filename}</small>

{/if}
      
<style>
  textarea {
    width: 100%;
    min-height: 200px;
  }
</style>