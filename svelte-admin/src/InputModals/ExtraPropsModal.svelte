
<script>
  
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    DataTable,
  } from "carbon-components-svelte";

  export let value = [] // array of objects with name, type, defaultValue, value
  export let submit;
  export let close;
  export let params;
  export let projectId;

  let headers = [
    { key: "name", value: "Prop" },
    { key: "value", value: "Value" },
  ]

  let rows = value.map(v => {return {
    name: v.name,
    value: v.value,
    type: v.type
  }})

  const updateCell = (row, cellValue) => {
    rows.find(r => r.name == row.name).value = cellValue
  }

  // write row changes back to bound value prop
  const updateValue = () => {
    value = rows.map(r => {return {
      name: r.name,
      value: r.value,
      type: r.type
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
        {#if cell.key === "value"}
          {#if row.type == "string"}
            <input value={row.value} on:input={(e)=>{updateCell(row, e.target.value)}}>
          {/if}
          {#if row.type == "number"}
            <input type="number" value={row.value} on:input={(e)=>{updateCell(row, e.target.value)}}>
          {/if}
          {#if row.type == "boolean"}
            <input type="checkbox" checked={row.value} on:change={(e)=>{updateCell(row, e.target.checked)}}>
          {/if}
        {:else}
          {cell.value}
        {/if}
      </svelte:fragment>
    </DataTable>

  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>

