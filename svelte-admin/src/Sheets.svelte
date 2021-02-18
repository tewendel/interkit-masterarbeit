<script>

  import { onDestroy } from 'svelte'
  import Sheet from './Sheet.svelte'
  import { InterkitClient } from 'interkit-shared'

  export let projectId

  let sheets;
  let subHandle;
  let currentSheetId;
  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) subHandle.stop()
    subHandle = await InterkitClient.getSub('sheets', 'sheets', [projectId], (s)=>s.projectId == projectId);
    sheets = subHandle.data
  }

  onDestroy(async ()=>{
    if(subHandle) {
      await subHandle.stop();
      subHandle = null;
    }
  })


  const createSheet = ()=>{
    InterkitClient.call('sheet.create', {projectId});
  }

  const openSheet = (sheet)=> {
    currentSheetId = sheet.id;
  }

</script>

{#if sheets}
  <ul>
  <!-- we need to use $sheets here to get the reactive value of the store -->
  {#each $sheets as sheet}
    <li on:click={()=>{openSheet(sheet)}}>{sheet.name}</li>
  {/each}
  </ul>
{:else}
  loading...
{/if}

<button on:click={createSheet}>Create Sheet</button>

{#if currentSheetId}
  <Sheet id={currentSheetId} {projectId} close={()=>{currentSheetId=null}}/>
{/if}

  
<style>
  li:hover {cursor: pointer}

</style>









