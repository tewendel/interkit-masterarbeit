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
  <h1>Project: {$currentProject.name}</h1>
  <WorkArea name="sheets"><Sheets {projectId}/></WorkArea>
  <WorkArea name="components"><ComponentEditor {projectId}/></WorkArea>
  <WorkArea name="preview"><Preview {projectId}/></WorkArea>
{:else}
  loading...
{/if}