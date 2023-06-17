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
  import EffectForm from './EffectForm.svelte';
  import StyleTokensForm from './StyleTokensForm.svelte';

  export let value = [] // array of objects with name, type, defaultValue, value, help
  console.log("ExtraPropsModal value", value)
  export let submit;
  export let close;
  export let params;
  export let projectId;

  let headers = [
    { key: "name", value: "Setting" },
    { key: "value", value: "Value" },
  ]

  // rows in the table of extra props
  let propRows = value.map(v => {return {
    id: v.name,
    ...v
  }})

  // temporary storage
  const updateCell = (propRow, cellValue) => {
    console.log("updateCell", propRow, cellValue)
    propRows.find(r => r.name == propRow.name).value = cellValue
  }

  // write changes back to bound value prop - make copies to avoid connected blocks after duplicate
  const updateValue = () => {
    value = propRows.map(r => {return JSON.parse(JSON.stringify(r))})
  }

  // construct default values if needed
  const getValue = (propRow) => {
    console.log("getValue", propRow)
    if(typeof propRow.value == "undefined") {
      if(propRow.type == "sheetColumn") {
        return {
          sheetKey: util.getSheetKey(propRow.defaultValue),
          columnKey: util.colKey(propRow.defaultValue),
          text: propRow.defaultValue
        }
      }
      if(propRow.type == "sheetId") {
        return {
          sheetKey: propRow.defaultValue,
          text: propRow.defaultValue
        }
      }
      return propRow.defaultValue
    } else {
      return propRow.value
    }
  }
  
  let databaseUpdateCount = 0 // counter to notify subcomponents to relad database structure on changes

</script>

<ComposedModal open
  on:submit={() => {updateValue(); submit();}}
  on:close={close}
>
  <ModalHeader label="" title={params.blockName} />
  <ModalBody>
    <DataTable {headers} rows={propRows}>
      <svelte:fragment slot="cell" let:row let:cell>
        <div style="padding:5px">
          {#if cell.key === "name"}
            <div class="prop-name">{row.name}</div>
            {#if row.help}<div class="prop-help">{row.help}</div>{/if}
          {/if}
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
            {#if row.type == "effect"}
              <EffectForm value={getValue(row)} on:update={(e)=>updateCell(row, e.detail)}/>
            {/if}
            {#if row.type == "styleTokens"}
              <StyleTokensForm value={getValue(row)} on:update={(e)=>updateCell(row, e.detail)} cloneInputObject/>
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
          {/if}
        </div>
      </svelte:fragment>
    </DataTable>

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>


<style>
  .prop-help {
    font-size: 80%;
    padding-top: 6px;
    max-width: 300px;
  }
</style>
