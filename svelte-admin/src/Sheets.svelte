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


  const createSheet = async ()=>{
    let id = await InterkitClient.call('sheet.create', {projectId});
    if(id) {
      currentSheetId = id;
    }
  }

  const openSheet = (sheet)=> {
    currentSheetId = sheet.id;
  }

</script>

{#if sheets}
  <ul>
  <!-- we need to use $sheets here to get the reactive value of the store -->
  {#each $sheets as sheet}
    <li class:active="{currentSheetId == sheet.id}" on:click={()=>{openSheet(sheet)}}>{sheet.name}</li>
  {/each}
  </ul>
{:else}
  loading...
{/if}

<br>
<button on:click={createSheet}>Create Sheet</button>
<br><br>

{#if currentSheetId}
  <Sheet id={currentSheetId} {projectId} close={()=>{currentSheetId=null}}/>
{/if}

  
<style>
  li:hover {cursor: pointer}

  .active {
    font-weight: bold;
  }

</style>









