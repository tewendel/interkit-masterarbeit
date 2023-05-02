<script>

  import { InterkitClient } from 'interkit'
  import { projectId } from '../admin.js'
  import { Select, SelectItem, InlineNotification, NotificationActionButton } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from 'svelte'

  import { createSheet, createColumn } from '../checkDatabase.js'

  export let value = {};
  export let columnInfo;

  const dispatch = createEventDispatcher();

  let sheets;
  let columns;

  const updateColumns = () => {
    let sheet = sheets.find(s=>s.key == value?.sheetKey)
    columns = sheet?.columns;
    //console.log(sheet)
    if(value.sheetKey == "empty") value.text = "";
  }

  const loadSheets = async () => {
    sheets = await InterkitClient.call("sheets.get", {projectId: $projectId})         
  }

  onMount(async ()=>{
    await loadSheets();
    //console.log("SheetColumnSelectForm mount with", sheets, value);
    updateColumns();
  })

  const createSheetAndReload = async (value) => {
    await createSheet(value, $projectId)
    await loadSheets();
    updateColumns();
  }

  const createColumnAndReload = async (value) => {
    await createColumn(columnInfo, value, $projectId)
    await loadSheets();
    updateColumns();
  }


  const updateHumanReadable = () => {
    //console.log("updateHumanReadable", value)
    if(value.columnKey == "empty") {
      value.text = "";
    } else {
      value.text = 
        sheets.find(s=>s.key == value?.sheetKey)?.name + 
        "/" + 
        columns.find(c=>c.key == value?.columnKey)?.name;
      value.columnType = columns.find(c=>c.key == value?.columnKey)?.type;
    }
    dispatch("update", value);
  }
  
  </script>
  
  {#if sheets}
    <Select labelText="Sheet" bind:selected={value.sheetKey} on:update={updateColumns}>
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

  {#if columns}
    <Select labelText="Column" bind:selected={value.columnKey} on:update={updateHumanReadable}>
        <SelectItem value="empty" text="not connected" />
        {#each columns as column}
          <SelectItem value={column.key} text={column.name} />
        {/each}
    </Select>
    {#if !columns.find(c => c.key == value.columnKey)}
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="warning"
      subtitle="This column is currently set to '{value.columnKey}', but this column doesn't exist in your database. Would you like to create it?"
    >
      <svelte:fragment slot="actions">
        <NotificationActionButton on:click={()=>createColumnAndReload(value)}>Create</NotificationActionButton>
      </svelte:fragment>
      </InlineNotification>
    {/if}
  {/if}
  
  <style>
    
  </style>