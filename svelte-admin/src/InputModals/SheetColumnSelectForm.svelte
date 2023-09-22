<script>

  import { InterkitClient } from 'interkit'
  import { projectId } from '../admin.js'
  import { Select, SelectItem, InlineNotification, NotificationActionButton } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from 'svelte'

  import { createSheet, createColumn } from '../App/checkDatabase.js'

  export let value = {};
  export let columnInfo;
  
  export let databaseUpdateCount = 0;

  const dispatch = createEventDispatcher();

  let sheets;
  let columns;

  const loadSheets = async () => {
    //console.log("SheetColumnSelectForm loadSheets", databaseUpdateCount)
    sheets = await InterkitClient.call("sheets.get", {projectId: $projectId})         
  }

  const updateColumns = () => {
    let sheet = sheets.find(s=>s.key == value?.sheetKey)
    columns = sheet?.columns;
    if(value.sheetKey == "empty") value.text = "";
    //console.log("updateColumns", value)
    updateHumanReadable();
  }

  const refreshDatabase = async () => {
    await loadSheets();
    updateColumns();
  }

  $: {
    databaseUpdateCount;
    refreshDatabase();
  }

  const createSheetAndReload = async (value) => {
    await createSheet(value, $projectId)
    databaseUpdateCount += 1;
  }

  const createColumnAndReload = async (value) => {
    await createColumn(columnInfo, value, $projectId)
    databaseUpdateCount += 1;
  }

  const updateHumanReadable = () => {
    //console.log("updateHumanReadable", value, sheets, columns)
    if(value.columnKey == "empty") {
      value.text = "";
    } else {
      if(columns) {
        value.text = 
          sheets.find(s=>s.key == value?.sheetKey)?.name + 
          "/" + 
          columns.find(c=>c.key == value?.columnKey)?.name;
        value.columnType = columns.find(c=>c.key == value?.columnKey)?.type;
      }
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
    {#if !sheets.find(s => s.key === value.sheetKey) && value.sheetKey !== 'empty' && value.sheetKey !== ''}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="warning"
        subtitle="This sheet is currently set to '{value.sheetKey}', but a sheet with this key doesn't exist in your database. Would you like to create it?"
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
    {#if !columns.find(c => c.key === value.columnKey) && value.columnKey !== 'empty' && value.sheetKey !== ''}
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
