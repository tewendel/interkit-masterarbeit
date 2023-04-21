<script>
  
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    DataTable,
    TextInput
  } from "carbon-components-svelte"

  import SheetColumnSelectForm from './SheetColumnSelectForm.svelte'
  import SheetIdSelectForm from './SheetIdSelectForm.svelte'

  export let value = [] // array of objects with name, type, defaultValue, value
  export let submit;
  export let close;
  export let params;
  export let projectId;

  let headers = [
    { key: "name", value: "Prop" },
    { key: "value", value: "Value" },
  ]

  // rows in the table of extra props (not to be confused with rows in a data sheet!)
  let rows = value.map(v => {return {
    id: v.name,
    name: v.name,
    value: v.value,
    type: v.type,
    defaultValue: v.defaultValue
  }})

  const updateCell = (row, cellValue) => {
    rows.find(r => r.name == row.name).value = cellValue
  }

  // write row changes back to bound value prop
  const updateValue = () => {
    value = rows.map(r => {return {
      name: r.name,
      value: r.value,
      type: r.type,
    }})
  }

</script>

<ComposedModal open
  on:submit={() => {updateValue(); submit();}}
  on:close={close}
>
  <ModalHeader label="" title="Extra Props" />
  <ModalBody>
    <DataTable {headers} {rows}>
      <svelte:fragment slot="cell" let:row let:cell>
        <div style="padding:5px">
          {#if cell.key === "value"}
            {#if row.type == "string"}
              <TextInput value={row.value || row.defaultValue} on:change={(e)=>{updateCell(row, e.detail)}}/>
            {/if}
            {#if row.type == "number"}
              <TextInput value={row.value || row.defaultValue} on:input={(e)=>{updateCell(row, e.detail)}}/>
            {/if}
            {#if row.type == "color"}
              <input type="color" value={row.value || row.defaultValue} on:input={(e)=>{updateCell(row, e.target.value)}}>
            {/if}
            {#if row.type == "boolean"}
              <input type="checkbox" checked={row.value || row.defaultValue} on:change={(e)=>{updateCell(row, e.target.checked)}}>
            {/if}
            {#if row.type == "sheetColumn"}
              <SheetColumnSelectForm value={row.value} on:update={(e)=>updateCell(row, e.detail)}/>          
            {/if}
            {#if row.type == "sheetId"}
              <SheetIdSelectForm value={row.value} on:update={(e)=>updateCell(row, e.detail)}/>          
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

