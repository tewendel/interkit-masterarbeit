<script>
  import ProjectWorkspace from './ProjectWorkspace.svelte'
  import { push, replace } from 'svelte-spa-router';
  import { onMount } from 'svelte'
  import InterkitClient from '../../shared/interkit-client.js'

  export let params = {}

  let sub;
  let projects;

  onMount(async ()=>{
    console.log("onMount")
    sub = await InterkitClient.getSub('projects', 'projects')  
    projects = sub.data;
  })

  let newProjectName;
  const createProject = async () => {
    await InterkitClient.call("project.create", {name: newProjectName})
    newProjectName = null;
  }

  $: currentProjectId = params.projectId
      
  const removeProject = async (projectId) => {
    if(confirm("really delete project?")) {
      await InterkitClient.call("project.remove", {projectId})
      currentProject = null;
    }
  }

</script>

{#if currentProjectId}
  
  <span class="clickable" on:click={()=> {replace('/')}}>close project</span><br>
  <ProjectWorkspace projectId={currentProjectId}/>

{:else}

  {#if projects}

    <h1>projects</h1>

    <ul>
    <!-- we need to use $projects here to get the reactive value of the store -->
    {#each $projects as project}
      <li>
        <span on:click={()=>{console.log(project); push('/'+project.id)}} class="clickable">{project.name}</span>
        <span on:click={()=>removeProject(project.id)} class="clickable">x</span>
      </li>
    {/each}
    </ul>

    <h2>new project</h2>
    <input bind:value={newProjectName}>
    <button on:click={createProject}>create project</button>

  {/if}

{/if}


<style>
  .clickable:hover {
    cursor: pointer;
  }
</style>

