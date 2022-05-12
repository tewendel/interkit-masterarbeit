<script>

  import { onDestroy } from 'svelte'
  import Sheet from './Sheet.svelte'
  import { Button } from "carbon-components-svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import { InterkitClient } from 'interkit'

  export let projectId

  let sheets;
  let subHandle;
  let currentSheetKey;
  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('sheets', 'sheets', {projectId}, (s)=>s.projectId == projectId);
    sheets = subHandle.data
  }

  onDestroy(async ()=>{
    if(subHandle) {
      await subHandle.stop();
      subHandle = null;
    }
  })

  const createSheet = async ()=>{
    let name = prompt("Give the new sheet a name")
    let key = await InterkitClient.call('sheet.create', {projectId, name});
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
      <li on:click={()=>{openSheet(sheet)}}>
        <img class="icon" src="images/sheet_icon.png"/><br/>
        <div style="text-align: center;">{sheet.name}</div>
      </li>
    {/each}
    </ul>
  {:else}
    loading...
  {/if}

  <br>
  <Button icon={Add} size="small" on:click={createSheet}>Create Sheet</Button>

{/if}

{#if currentSheetKey}
  <Sheet sheetKey={currentSheetKey} {projectId} close={()=>{currentSheetKey=null}}/>
{/if}

  
<style>
  li:hover {cursor: pointer}

  .active {
    font-weight: bold;
  }

  li {
    width: 120px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  li img.icon {
    width: 100px;
  }

</style>









