<script>

  import { onDestroy } from 'svelte'

  import { InterkitClient } from 'interkit'
  import Sheet from './Sheet.svelte'
  import { docsGo } from '../docs.js'

  import { Button, ButtonSet } from "carbon-components-svelte"

  import Add from "carbon-icons-svelte/lib/Add.svelte"
  import Help from "carbon-icons-svelte/lib/Help.svelte"

  import { currentProjectReadOnly } from '../admin'

  export let projectId

  let sheets;
  let subHandle;
  let currentSheetKey;
  
  $: resetSub(projectId)

  const resetSub = async (_projectId) => {
    console.log("resetSub sheets", _projectId)
    if(!_projectId) return
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('sheets', 'sheets', {projectId: _projectId}, (s)=>s.projectId == _projectId);
    sheets = subHandle.data
    currentSheetKey = null
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

<div class="container">

{#if !currentSheetKey}

  <div class="main-buttons">
    <ButtonSet>
      <Button
        icon={Help}
        kind="ghost"
        size="field"
        on:click={() => docsGo('/guides/overview/interface_overview#data')}
        >Help</Button>
      <Button
        disabled={$currentProjectReadOnly}
        icon={Add}
        size="field"
        on:click={createSheet}
        >Create Sheet</Button>
    </ButtonSet>
  </div>

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


{/if}

{#if currentSheetKey}
  <Sheet sheetKey={currentSheetKey} {projectId} close={()=>{currentSheetKey=null}}/>
{/if}

</div>

  
<style>

  .container {
    padding: 56px 16px 16px 16px;
    position: relative;
  }

  .main-buttons {
    position: absolute;
    top: 0;
    right: 0;
  }

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









