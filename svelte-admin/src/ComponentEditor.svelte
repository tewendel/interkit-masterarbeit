<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import YAML from "yaml"
  import ConfigForm from './ConfigForm.svelte';
  import InterkitClient from '../../shared/interkit-client.js'

  export let projectId

  let files = [];
  let currentFile = null;
  let configObj = null;
  
  const loadFiles =  async () => {
    files = await InterkitClient.call("project.list", {projectId})  
  }

  $: setup(projectId)
  const setup = async (projectId) => {
    await loadFiles()  
  }
  
  let newFilename;
  const createFile = async (filename) => {
    await InterkitClient.call("file.create", {filename: newFilename, projectId})
    await loadFiles();  
    newFilename = null;
  }

  const openFile = async (filename) => {
    currentFile = await InterkitClient.call("file.load", {filename, projectId})  
    console.log(currentFile)

    if(filename.includes(".yml")) {
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

  const closeFile = () => {
    currentFile = null;
    configObj = null;
  }
  const saveFile = async () => {
    await InterkitClient.call("file.save", {file: currentFile, projectId})
    if(configObj) {
      initConfig(currentFile.content)
    }
  }


</script>


<ul>
{#each files as file}
  <li on:click={()=>{openFile(file)}}>{file}</li>
{/each}
</ul>
<input bind:value={newFilename}>
<button on:click={createFile}>create file</button><br>
  
{#if currentFile}
  <h2>file: {currentFile.filename} <button on:click={closeFile}>close</button></h2>

  <Tabs>
      <Tab label="config form" />
      <Tab label="file editor" />
    <div slot="content">
      <TabContent>
      {#if configObj}
        <ConfigForm {configObj} {configUpdate}/>
      {:else}
        <div>no config available, use file editor</div>
      {/if}
      </TabContent>
      <TabContent>
        <textarea bind:value={currentFile.content}></textarea><br>
        <button on:click={saveFile}>save</button>
      </TabContent>
    </div>
  </Tabs>

{/if}



<style>
  textarea {
    width: 400px;
    height: 150px;
  }
  li:hover {
    cursor: pointer;
  }

</style>
