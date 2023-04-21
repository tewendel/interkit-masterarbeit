<script>

  import { InterkitClient } from 'interkit'
  import { projectId } from '../admin.js'
  import { Select, SelectItem } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher();

  export let value = {};
  
  let sheets;
  
  onMount(async ()=>{
    sheets = await InterkitClient.call("sheets.get", {projectId: $projectId})         
    console.log(sheets);
    updateHumanReadable();
  })

  const updateHumanReadable = () => {
    value.text = 
      sheets.find(s=>s.key == value.sheetKey)?.name
    console.log("updateHumanReadable", value)
    
    dispatch("update", value);
  }
  
</script>

{#if sheets}
  <Select bind:selected={value.sheetKey} on:update={updateHumanReadable}>
      <SelectItem value="empty" text="nicht zugeordnet" />
      {#each sheets as sheet}
        <SelectItem value={sheet.key} text={sheet.name} />
      {/each}
  </Select>
{/if}
     
  
<style>
  
</style>