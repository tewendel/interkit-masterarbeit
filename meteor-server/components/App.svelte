<script>

  import { onMount } from 'svelte'
  import { Projects } from '../imports/collections.js';
  import Sheets from './Sheets.svelte';

  Meteor.subscribe('projects.public')
  // use mongo cursor as svelte store
  const projects = Projects.find({});

  let newProjectName;
  const createProject = () => {
    Meteor.call("project.create", {name: newProjectName})
    newProjectName = null;
  }

  let currentProject = null;
  let files = [];
  let currentFile = null;

  const bundleServerURL = "http://localhost:4000"

  $: previewURL = currentProject ? bundleServerURL + "/app/" + currentProject._id : null

  const loadFiles =  async () => {
    files = await Meteor.callAsync("project.list", {projectId: currentProject._id})  
  }

  const openProject = async (project) => {
    currentFile = null;
    currentProject = project
    await loadFiles()
  }

  const removeProject = () => {
    if(confirm("really?")) {
      Meteor.call("project.remove", {projectId: currentProject._id})
      currentProject = null;
    }
  }

  const compileProject = async () => {
    const res = await fetch(bundleServerURL + "/compile/" + currentProject._id)
    console.log(res)
  }

  const reloadPreview = () => {
    document.getElementById('app-preview').src = document.getElementById('app-preview').src
  }

  let newFilename;
  const createFile = async (filename) => {
    await Meteor.callAsync("file.create", {filename: newFilename, projectId: currentProject._id})
    await loadFiles();  
    newFilename = null;
  }

  const openFile = async (filename) => {
    currentFile = await Meteor.callAsync("file.load", {filename, projectId: currentProject._id})  
    console.log(currentFile)
  }
  const closeFile = () => {
    currentFile = null;
  }
  const saveFile = async () => {
    await Meteor.callAsync("file.save", {file: currentFile, projectId: currentProject._id})
  }

</script>

<h1>projects</h1>

<ul>
<!-- we need to use $projects here to get the reactive value of the store -->
{#each $projects as project}
  <li on:click={()=>{openProject(project)}}>{project.name}</li>
{/each}
</ul>

<h2>new project</h2>
<input bind:value={newProjectName}>
<button on:click={createProject}>create project</button>

{#if currentProject}
  <h1>project: {currentProject.name}</h1>
  <Sheets projectId={currentProject._id}/>
  <h2>Components</h2>
  <ul>
  {#each files as file}
    <li on:click={()=>{openFile(file)}}>{file}</li>
  {/each}
  </ul>
  <input bind:value={newFilename}>
  <button on:click={createFile}>create file</button><br>
  <button on:click={compileProject}>compile project</button><br>
  <button on:click={removeProject}>delete project</button>
{/if}

{#if currentFile}
  <h2>file: {currentFile.filename}</h2>
  <textarea bind:value={currentFile.content}></textarea><br>
  <button on:click={saveFile}>save</button>
  <button on:click={closeFile}>close</button>
{/if}

{#if currentProject} 
  <h2>preview</h2><br>
  <button on:click={reloadPreview}>reload</button><br>
  <iframe id="app-preview" src={previewURL}></iframe><br>
  <a target="_blank" href="{previewURL}">link to app</a>
{/if}

<style>
  li:hover {
    cursor: pointer;
  }
  textarea {
    width: 400px;
    height: 150px;
  }
</style>

