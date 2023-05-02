<script>

  import { InterkitClient } from 'interkit'
  import { projectId } from '../admin.js'
  import { Select, SelectItem, InlineNotification, NotificationActionButton } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from 'svelte'
  import { createSheet } from '../checkDatabase.js'

  const dispatch = createEventDispatcher();

  export let value = {};
  
  let sheets;

  const loadSheets = async () => {
    sheets = await InterkitClient.call("sheets.get", {projectId: $projectId})         
    console.log(sheets);
    updateHumanReadable();
  }
  
  onMount(()=>{
    loadSheets()
  })

  const updateHumanReadable = () => {
    value.text = 
      sheets.find(s=>s.key == value.sheetKey)?.name
    console.log("updateHumanReadable", value)
    
    dispatch("update", value);
  }

  const createSheetAndReload = async (value) => {
    await createSheet(value, $projectId)
    loadSheets();
  }
  
</script>

{#if sheets}
  <Select bind:selected={value.sheetKey} on:update={updateHumanReadable}>
      <SelectItem value="empty" text="not connected" />
      {#each sheets as sheet}
        <SelectItem value={sheet.key} text={sheet.name} />
      {/each}
  </Select>
  {#if !sheets.find(s => s.key == value.sheetKey)}
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="warning"
      subtitle="This sheet is currently set to '{value.sheetKey}', but this sheet doesn't exist in your database. Would you like to create it?"
    >
      <svelte:fragment slot="actions">
        <NotificationActionButton on:click={()=>createSheetAndReload(value)}>Create</NotificationActionButton>
      </svelte:fragment>
      </InlineNotification>
    {/if}
{/if}
     
  
<style>
  
</style>