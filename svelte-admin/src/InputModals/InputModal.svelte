<script>
  import LocationPicker from './LocationPicker.svelte';
  import SheetRefSelect from './SheetRefSelect.svelte';
  import ColumnTypeSelect from './ColumnTypeSelect.svelte';
  
  export let type = null
  export let value = {}
  export let submit
  export let close
  export let projectId
  export let params = {}

  /*$: {
    console.log("new input modal type", type)
  }*/

  const components = {
    "columnType": ColumnTypeSelect,
    "location": LocationPicker,
    "sheetRef": SheetRefSelect
  }

</script>

{#if type}
  <svelte:component this={components[type]}
    bind:value={value}
    submit = {()=>{close(); submit();}}
    {close}
    {projectId}
    {params}
  />
{/if}