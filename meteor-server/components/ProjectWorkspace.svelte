<script>
  import { Projects } from '../imports/collections.js';
  import WorkArea from './WorkArea.svelte';

  export let projectId
  $: setup(projectId)
  let currentProject;
  let subHandle;
  const setup = async (projectId) => {
    console.log(projectId)
    if(subHandle) subHandle.stop()
    subHandle = await Meteor.subscribe('projects.public')
    currentProject = Projects.findOne(projectId)
  }

  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import Preview from './Preview.svelte'

</script>

{#if currentProject}
  <h1>Project: {currentProject.name}</h1>
  <WorkArea name="sheets"><Sheets {projectId}/></WorkArea>
  <WorkArea name="components"><ComponentEditor {projectId}/></WorkArea>
  <WorkArea name="preview"><Preview {projectId}/></WorkArea>
{:else}
  loading...
{/if}