<script>
  import { onDestroy } from 'svelte'
  import WorkArea from './WorkArea.svelte';
  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import Preview from './Preview.svelte'
  import { InterkitClient } from 'interkit-shared'

  export let projectId
  $: setup(projectId)
  let sub;
  let currentProject;
  
  const setup = async (projectId) => {
    console.log("workspace", projectId)
    sub = await InterkitClient.getSub('projects', 'projects', [], (p)=>p.id == projectId, true);
    currentProject = sub.data;
  }

  onDestroy(async ()=>{
    if(sub) {
      /* if you do this, it will also stop the projects subscription on the parent compoment! */
      //await sub.stop();
      //sub = null;
    }
  })

</script>

{#if $currentProject}
  <h1>project: {$currentProject.name}</h1>
  <div class="left-pane">
    <WorkArea name="database"><Sheets {projectId}/></WorkArea>
    <WorkArea name="app components"><ComponentEditor {projectId}/></WorkArea>
  </div>
  <div class="right-pane">
    <WorkArea name="app preview"><Preview {projectId}/></WorkArea>
  </div>
{:else}
  loading...
{/if}


<style>

  h1 {
    margin-bottom: 10px;
  }
  .left-pane {
    width: 50%;
    float: left;
  }

  .right-pane {
    width: 50%;
    float: right;
  }
</style>
