<script>
  import MainColumns from '../Layout/MainColumns.svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleEditor from './StyleEditor.svelte'

  let currentStyleTokens = null

</script>

<MainColumns
  sidebarLeftLabel="Themes"
  >

  <svelte:fragment slot="sidebarLeft">
    
  </svelte:fragment>

  <svelte:fragment slot="contentMain">
    <div class="main">

      <StyleEditor bind:currentStyleTokens />
      <ComponentsShowcase {currentStyleTokens} />

    </div>  
  </svelte:fragment>
</MainColumns>

<style>
  .main {
    padding: .5rem;
    height: 100%;
    overflow: auto;
  }
</style>