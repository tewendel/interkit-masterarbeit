<script>
  import MainColumns from '../Layout/MainColumns.svelte'
  import StyleEditor from './StyleEditor.svelte'
</script>

<MainColumns
  sidebarLeftLabel="Styles"
  >

  <svelte:fragment slot="sidebarLeft">
    
  </svelte:fragment>

  <svelte:fragment slot="contentMain">
    <StyleEditor />
  </svelte:fragment>
</MainColumns>

<style>
</style>