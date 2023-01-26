<script>
  import LocationPicker from './LocationPicker.svelte';
  import SheetRefSelect from './SheetRefSelect.svelte';
  import ColumnTypeSelect from './ColumnTypeSelect.svelte';
  import SheetColumnSelect from './SheetColumnSelect.svelte';
  import SheetIdSelect from './SheetIdSelect.svelte'
  import MediaFileSelect from './MediaFileSelect.svelte';
  import OptionSelect from './OptionSelect.svelte';
  import RichtTextModal from './RichtTextModal.svelte';
  import DateModal from './DateModal.svelte';
  import ExtraPropsModal from './ExtraPropsModal.svelte';
  
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
    "optionSelect": OptionSelect,
    "richText": RichtTextModal,
    "date": DateModal,
    "extraProps": ExtraPropsModal,
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