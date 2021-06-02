<script context="module">
  import { writable } from 'svelte/store';
  export let currentProjectName = writable(null);
</script>

<script>
  import ProjectWorkspace from './ProjectWorkspace.svelte'
  import { push, replace } from 'svelte-spa-router';
  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'
  import Logout from './Logout.svelte';
  import { 
    Grid,
    Row,
    Column,
    UnorderedList,
    ListItem,
    Tile,
    DataTable, Link
  } from "carbon-components-svelte";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";
  import Copy16 from "carbon-icons-svelte/lib/Copy16";
  import Edit16 from "carbon-icons-svelte/lib/Edit16";

  export let params = {}

  let userId = InterkitClient.userId;

  let sub;
  let projects;
  let currentProject;
  let newProjectName;

  const destroyProjectsSub = async () => {
    if (sub) {
      await sub.stop();
      sub = null;
    }
  }

  const manageProjectsSub = async (projectId)=>{
    console.log("project subscription " + projectId)
    destroyProjectsSub() // not sure if nessesary
    if (projectId) {
      sub = await InterkitClient.getSub('projects', 'projects', null, (p)=>p.id == projectId, true)
      currentProject = sub.data
    } else {
      sub = await InterkitClient.getSub('projects', 'projects') 
      projects = sub.data;
    }
  }

  const createProject = async () => {
    await InterkitClient.call("project.create", {name: newProjectName})
    newProjectName = null;
  }

  onDestroy(destroyProjectsSub)

  $: currentProjectId = params.projectId

  $: manageProjectsSub(currentProjectId)

  $: {
    currentProjectName.set($currentProject ? $currentProject.name : null)
  }

  // add "id" for carbon table
  $: projectRows = projects ? $projects.map( p => ({...p, id: p.id})) : []
      
  const removeProject = async (projectId) => {
    if(confirm("really delete project?")) {
      await InterkitClient.call("project.remove", {projectId})
    }
  }

  const renameProject = async (row) => {
    let newName = prompt("Projekt umbenennen", row.name)
    if(newName) {
      await InterkitClient.call("project.rename", {projectId: row._id, newName});
    }
  }

  const duplicateProject = async (projectId) => {
    console.log("duplicating database")
    const newProjectId = await InterkitClient.call("project.duplicate", {projectId})
  }

</script>

<Grid style="padding:0;">
  <Row>
    <Column lg="{16}">
    
      {#if currentProjectId}
        <ProjectWorkspace projectId={currentProjectId} {currentProject}/>
      {:else}

      
      <DataTable
        headers={[{ key: 'name', value: 'Projects' }, { key: 'action', value: 'Action', empty: true }]}
        rows={projectRows}
        size="tall"
      >
        <span slot="cell" let:row let:cell>
          {#if cell.key === 'action'}
            <div class="actions">
              <span title="rename" on:click={()=>renameProject(row)} class="clickable"> <Edit16 /></span>
              <span title="duplicate" on:click={()=>duplicateProject(row.id)} class="clickable"> <Copy16 /></span>
              <span title="delete" on:click={()=>removeProject(row.id)} class="clickable"> <Delete16 /></span>
            </div>
          {:else}
            
            <span on:click={()=>{push('/'+row.id)}} class="clickable">{row.name}</span>

          {/if}
        </span>
      </DataTable>
        
        

      {/if}

    </Column>
  </Row>

  {#if !currentProjectId}
  <Row>
    <div class="project-create-form">
          <input bind:value={newProjectName}>
          <button on:click={createProject}>create project</button>
    </div>
  </Row>
  {/if}
  <Row>{#if $userId} 
    <div class="logout">
      <Logout/> 
    </div>
  {/if}
  </Row>
  <Row>
    <Column>
      <Tile>
        Admin Version: {INTERKIT_IMAGE_TAG}
      </Tile>
    </Column>
  </Row>
</Grid>

<style>
  .project-create-form {
    margin-top: 10px;
    margin-left: 15px;
    padding: 15px;
  }

  .logout {
    padding: 15px;
  }

  .actions {
    text-align: right;
  }
  .clickable {
    padding: 0 0.5em;
  }
  .clickable:hover {
    cursor: pointer;
  }
</style>