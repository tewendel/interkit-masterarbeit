<script>

  import YAML from "yaml"
  import ConfigForm from './ConfigForm';

  export let projectId

  let files = [];
  let currentFile = null;
  let configObj = null;
  
  const loadFiles =  async () => {
    files = await Meteor.callAsync("project.list", {projectId})  
  }

  $: setup(projectId)
  const setup = async (projectId) => {
    await loadFiles()  
  }
  
  let newFilename;
  const createFile = async (filename) => {
    await Meteor.callAsync("file.create", {filename: newFilename, projectId})
    await loadFiles();  
    newFilename = null;
  }

  const openFile = async (filename) => {
    currentFile = await Meteor.callAsync("file.load", {filename, projectId})  
    console.log(currentFile)

    if(filename.includes(".yml")) {
      initConfig(currentFile.content) 
    } else {
      configObj = null;
    }
  }

  const initConfig = (fileContent) => {
    try {
        configObj = YAML.parse(fileContent)  
    } 
    catch(e) {
        console.log(e)
    }
      
    console.log(configObj)
  }

  const configUpdate = (newConfig) => {
    currentFile.content = YAML.stringify(newConfig)
  }

  const closeFile = () => {
    currentFile = null;
    configObj = null;
  }
  const saveFile = async () => {
    await Meteor.callAsync("file.save", {file: currentFile, projectId})
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
  <h2>file: {currentFile.filename}</h2>
  <textarea bind:value={currentFile.content}></textarea><br>
  <button on:click={saveFile}>save</button>
  <button on:click={closeFile}>close</button>
{/if}

{#if currentFile && configObj}
  <ConfigForm {configObj} {configUpdate}/>
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
