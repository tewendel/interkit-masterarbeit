<script>
  
  import { util } from 'interkit'
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    DataTable,
    TextInput,
    Select, 
    SelectItem,
  } from "carbon-components-svelte"

  import SheetColumnSelectForm from './SheetColumnSelectForm.svelte'
  import SheetIdSelectForm from './SheetIdSelectForm.svelte'
  import ClickEffectForm from './ClickEffectForm.svelte';

  export let value = [] // array of objects with name, type, defaultValue, value
  export let submit;
  export let close;
  export let params;
  export let projectId;

  let headers = [
    { key: "name", value: "Setting" },
    { key: "value", value: "Value" },
  ]

  // rows in the table of extra props (not to be confused with rows in a data sheet!)
  let rows = value.map(v => {return {
    id: v.name,
    ...v
  }})

  // temporary storage
  const updateCell = (row, cellValue) => {
    console.log("updateCell", row, cellValue)
    rows.find(r => r.name == row.name).value = cellValue
  }

  // write changes back to bound value prop - make copies to avoid connected blocks after duplicate
  const updateValue = () => {
    value = rows.map(r => {return JSON.parse(JSON.stringify(r))})
  }

  // construct default values if needed
  const getValue = (row) => {
    console.log("getValue", row)
    if(typeof row.value == "undefined") {
      if(row.type == "sheetColumn") {
        return {
          sheetKey: util.getSheetKey(row.defaultValue),
          columnKey: util.colKey(row.defaultValue),
          text: row.defaultValue
        }
      }
      if(row.type == "sheetId") {
        return {
          sheetKey: row.defaultValue,
          text: row.defaultValue
        }
      }
      return row.defaultValue
    } else {
      return row.value
    }
  }
  
  let databaseUpdateCount = 0 // counter to notify subcomponents to relad database structure on changes

</script>

<ComposedModal open
  on:submit={() => {updateValue(); submit();}}
  on:close={close}
>
  <ModalHeader label="" title="Component Settings" />
  <ModalBody>
    <DataTable {headers} {rows}>
      <svelte:fragment slot="cell" let:row let:cell>
        <div style="padding:5px">
          {#if cell.key === "value"}
            {#if row.type == "string"}
              <TextInput value={getValue(row)} on:change={(e)=>{updateCell(row, e.detail)}}/>
            {/if}
            {#if row.type == "number"}
              <TextInput value={getValue(row)} on:input={(e)=>{updateCell(row, e.detail)}}/>
            {/if}
            {#if row.type == "color"}
              <input type="color" value={getValue(row)} on:input={(e)=>{updateCell(row, e.target.value)}}>
            {/if}
            {#if row.type == "checkbox"}
              <input type="checkbox" checked={getValue(row)} on:change={(e)=>{updateCell(row, e.target.checked)}}>
            {/if}
            {#if row.type == "sheetColumn"}
              <SheetColumnSelectForm columnInfo={row} value={getValue(row)} on:update={(e)=>updateCell(row, e.detail)} bind:databaseUpdateCount/>          
            {/if}
            {#if row.type == "sheetId"}
              <SheetIdSelectForm value={getValue(row)} on:update={(e)=>updateCell(row, e.detail)} bind:databaseUpdateCount/>          
            {/if}
            {#if row.type == "clickEffect"}
              <ClickEffectForm value={getValue(row)} on:update={(e)=>updateCell(row, e.detail)}/>
            {/if}
            {#if row.type == "options" && row?.options?.length}
              <Select
                on:change={(e) => updateCell(row, e.target.value)}
                selected = {row.value}
              >
                {#each row.options as option}
                  <SelectItem value={option} />
                {/each}
              </Select> 
            {/if}
          {:else}
            {cell.value}
          {/if}
        </div>
      </svelte:fragment>
    </DataTable>

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>

