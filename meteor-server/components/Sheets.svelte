<script>

  import { Sheets } from '../imports/collections.js';
  import '../imports/methods.js';
  import { onDestroy } from 'svelte'
  import Sheet from './Sheet.svelte'
  
  export let projectId

  let sheets;
  let subHandle;
  let currentSheetId;
  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) subHandle.stop()
    subHandle = Meteor.subscribe('sheets', projectId);
    sheets = Sheets.find({projectId});
  }

  const createSheet = ()=>{
    Meteor.call('sheet.create', {projectId});
  }

  const openSheet = (sheet)=> {
    currentSheetId = sheet._id;
  }

</script>

<h2>Sheets</h2>
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
  <Sheet id={currentSheetId}/>
{/if}

  
<style>
  li:hover {cursor: pointer}

</style>









