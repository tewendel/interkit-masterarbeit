<script>
  import ProjectWorkspace from './ProjectWorkspace.svelte'
  import { push, replace } from 'svelte-spa-router';
  import { onMount } from 'svelte'
  import { InterkitClient } from 'interkit'

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

  // add "id" for carbon table
  $: projectRows = projects ? $projects.map( p => ({...p, id: p.id})) : []
      
  const removeProject = async (projectId) => {
    if(confirm("really delete project?")) {
      await InterkitClient.call("project.remove", {projectId})
    }
  }

</script>


<Grid>
  <Row>
    <Column lg="{16}">
    
      {#if currentProjectId}
        <button on:click={()=> {replace('/')}}>&lt;&lt;</button><br>
        <ProjectWorkspace projectId={currentProjectId}/>
      {:else}

        <DataTable
          headers={[{ key: 'name', value: 'projects' }, { key: 'action', value: 'Action', empty: true }]}
          rows={projectRows}
          size="tall"
        >
          <span slot="cell" let:row let:cell>
            {#if cell.key === 'action'}
                <span on:click={()=>removeProject(row.id)} class="clickable"> <Delete16 /></span>
            {:else}
              
              <span on:click={()=>{push('/'+row.id)}} class="clickable">{row.name}</span>

            {/if}
          </span>
        </DataTable>

        <br><br>
        <input bind:value={newProjectName}>
        <button on:click={createProject}>create project</button>

      {/if}

    </Column>
  </Row>
</Grid>

<style>
  .clickable:hover {
    cursor: pointer;
  }
</style>