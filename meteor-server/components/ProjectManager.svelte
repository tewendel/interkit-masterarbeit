
<script>

  import { Projects } from '../imports/collections.js';
  import ProjectWorkspace from './ProjectWorkspace.svelte'
  
  import { push, replace } from 'svelte-spa-router';

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

  Meteor.subscribe('projects.public')
  // use mongo cursor as svelte store
  const projects = Projects.find({});

  let newProjectName;
  const createProject = () => {
    Meteor.call("project.create", {name: newProjectName})
    newProjectName = null;
  }

  $: currentProjectId = params.projectId

  $: projectRows = $projects.map( p => ({...p, id:p._id})) // add "id" for carbon table
      
  const removeProject = (projectId) => {
    if(confirm("really delete project?")) {
      Meteor.call("project.remove", {projectId})
      currentProject = null;
    }
  }

</script>

<Grid>
  <Row>
    <Column lg="{16}">
    
      {#if currentProjectId}
        <span class="clickable" on:click={()=> {replace('/')}}>close project</span><br>
        <ProjectWorkspace projectId={currentProjectId}/>
      {:else}

        <h1>Projects</h1>

        <DataTable
          headers={[{ key: 'name', value: 'Project' }, { key: 'action', value: 'Action', empty: true }]}
          rows={projectRows}
          size="tall"
        >
          <span slot="cell" let:row let:cell>
            {#if cell.key === 'action'}
                <span on:click={()=>removeProject(row._id)} class="clickable"> <Delete16 /></span>
            {:else}
              
              <span on:click={()=>{push('/'+row._id)}} class="clickable">{row.name}</span>

            {/if}
          </span>
        </DataTable>

        <h1>Projects (non-carbon)</h1>
        <ul>
        <!-- we need to use $projects here to get the reactive value of the store -->
        {#each $projects as project}
          <li>
            <Tile>
            <span on:click={()=>{push('/'+project._id)}} class="clickable">{project.name}</span>
            <span on:click={()=>removeProject(project._id)} class="clickable">x</span>
            </Tile>
          </li>
        {/each}
        </ul>

        <h2>new project</h2>
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

