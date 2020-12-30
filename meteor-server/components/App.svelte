<script>

  import { onMount } from 'svelte'
  import { Projects } from '../imports/collections.js';

  Meteor.subscribe('projects.public')
  // use mongo cursor as svelte store
  const projects = Projects.find({});

  let projectName;
  const createProject = () => {
    Meteor.call("project.create", {name: projectName})
  }

  let currentProject = null;
  let files = [];
  const openProject = async (project) => {
    currentProject = project
    files = await Meteor.callAsync("project.list", {projectId: currentProject._id})
    console.log(files)
  }

  const removeProject = () => {
    if(confirm("really?")) {
      Meteor.call("project.remove", {projectId: currentProject._id})
      currentProject = null;
    }
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
<input bind:value={projectName}>
<button on:click={createProject}>create</button>

{#if currentProject}
  <h1>project: {currentProject.name}</h1>
  <ul>
  {#each files as file}
    <li>{file}</li>
  {/each}
  </ul>
  <button on:click={removeProject}>delete project</button>
{/if}

