
<script>

  import { Projects } from '../imports/collections.js';
  import ProjectWorkspace from './ProjectWorkspace.svelte'
  
  import { push, replace } from 'svelte-spa-router';
  export let params = {}

  Meteor.subscribe('projects.public')
  // use mongo cursor as svelte store
  const projects = Projects.find({});

  let newProjectName;
  const createProject = () => {
    Meteor.call("project.create", {name: newProjectName})
    newProjectName = null;
  }

  $: currentProjectId = params.projectId
      
  const removeProject = (projectId) => {
    if(confirm("really delete project?")) {
      Meteor.call("project.remove", {projectId})
      currentProject = null;
    }
  }

</script>

{#if currentProjectId}
  <span class="clickable" on:click={()=> {replace('/')}}>close project</span><br>
  <ProjectWorkspace projectId={currentProjectId}/>
{:else}

  <h1>projects</h1>

  <ul>
  <!-- we need to use $projects here to get the reactive value of the store -->
  {#each $projects as project}
    <li>
      <span on:click={()=>{push('/'+project._id)}} class="clickable">{project.name}</span>
      <span on:click={()=>removeProject(project._id)} class="clickable">x</span>
    </li>
  {/each}
  </ul>

  <h2>new project</h2>
  <input bind:value={newProjectName}>
  <button on:click={createProject}>create project</button>

{/if}


<style>
  .clickable:hover {
    cursor: pointer;
  }
</style>

