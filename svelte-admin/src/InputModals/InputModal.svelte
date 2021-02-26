<script>
  import LocationPicker from './LocationPicker.svelte';
  import SheetRefSelect from './SheetRefSelect.svelte';
  import ColumnTypeSelect from './ColumnTypeSelect.svelte';
  
  export let type = null
  export let value
  export let submit
  export let close

  $: {
    console.log("new input modal type", type)
  }

  const components = {
    "columnType": ColumnTypeSelect,
    "location": LocationPicker,
    "sheetRefSingle": SheetRefSelect
  }

</script>

{#if type}
  <svelte:component this={components[type]}
    bind:value={value}
    submit = {()=>{close(); submit();}}
    {close}
  />
{/if}