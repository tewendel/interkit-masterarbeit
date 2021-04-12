<script>
  import LocationPicker from './LocationPicker.svelte';
  import SheetRefSelect from './SheetRefSelect.svelte';
  import ColumnTypeSelect from './ColumnTypeSelect.svelte';
  import SheetColumnSelect from './SheetColumnSelect.svelte';
  import SheetIdSelect from './SheetIdSelect.svelte'
  import MediaFileSelect from './MediaFileSelect.svelte';
  
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
    "sheetRef": SheetRefSelect,
    "sheetColumn": SheetColumnSelect,
    "sheetId": SheetIdSelect,
    "mediaFile": MediaFileSelect,
  }

</script>

{#if type}

  <svelte:component this={components[type]}
    bind:value={value}
    submit = {()=>{submit(); close();}}
    {close}
    {projectId}
    {params}
  />

{/if}

<style>


</style>