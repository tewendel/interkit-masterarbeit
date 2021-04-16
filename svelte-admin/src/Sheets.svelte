<script>

  import { onDestroy } from 'svelte'
  import Sheet from './Sheet.svelte'
  import { InterkitClient } from 'interkit'

  export let projectId

  let sheets;
  let subHandle;
  let currentSheetKey;
  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
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
    let key = await InterkitClient.call('sheet.create', {projectId});
    if(key) {
      currentSheetKey = key;
    }
  }

  const openSheet = (sheet)=> {
    currentSheetKey = sheet.key;
  }

</script>

{#if !currentSheetKey}

  {#if sheets}
    <ul>
    <!-- we need to use $sheets here to get the reactive value of the store -->
    {#each $sheets as sheet}
      <li class:active="{currentSheetKey == sheet.key}" on:click={()=>{openSheet(sheet)}}>{sheet.name}</li>
    {/each}
    </ul>
  {:else}
    loading...
  {/if}

  <br>
  <button on:click={createSheet}>Create Sheet</button>

{/if}

{#if currentSheetKey}
  <Sheet sheetKey={currentSheetKey} {projectId} close={()=>{currentSheetKey=null}}/>
{/if}

  
<style>
  li:hover {cursor: pointer}

  .active {
    font-weight: bold;
  }

</style>









