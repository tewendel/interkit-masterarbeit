<script>

  export let projectId

  let files = [];
  let currentFile = null;
  
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
  }
  const closeFile = () => {
    currentFile = null;
  }
  const saveFile = async () => {
    await Meteor.callAsync("file.save", {file: currentFile, projectId})
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


<style>
  textarea {
    width: 400px;
    height: 150px;
  }
  li:hover {
    cursor: pointer;
  }

</style>
