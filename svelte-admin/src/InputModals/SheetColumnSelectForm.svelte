<script>

  import { InterkitClient } from 'interkit'
  import { projectId } from '../admin.js'
  import { Select, SelectItem } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from 'svelte'

  export let value = {};

  const dispatch = createEventDispatcher();

  let sheets;
  let columns;

  const updateColumns = () => {
    let sheet = sheets.find(s=>s.key == value?.sheetKey)
    columns = sheet?.columns;
    //console.log(sheet)
    if(value.sheetKey == "empty") value.text = "";
  }

  onMount(async ()=>{
    sheets = await InterkitClient.call("sheets.get", {projectId: $projectId})         
    //console.log("SheetColumnSelectForm mount with", sheets, value);
    updateColumns();
  })

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
        <SelectItem value="empty" text="nicht zugeordnet" />
        {#each sheets as sheet}
          <SelectItem value={sheet.key} text={sheet.name} />
        {/each}
    </Select>
  {/if}

  {#if columns}
    <Select labelText="Column" bind:selected={value.columnKey} on:update={updateHumanReadable}>
        <SelectItem value="empty" text="nicht zugeordnet" />
        {#each columns as column}
          <SelectItem value={column.key} text={column.name} />
        {/each}
    </Select>
  {/if}
  
  
  <style>
    
  </style>