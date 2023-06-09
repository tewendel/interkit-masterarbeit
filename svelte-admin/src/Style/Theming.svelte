<script>
  import MainColumns from '../Layout/MainColumns.svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
</script>

<MainColumns
  sidebarLeftLabel="Themes"
  >

  <svelte:fragment slot="sidebarLeft">
    
  </svelte:fragment>
   
  <svelte:fragment slot="contentMain">
    <div class="main">
      
      <ComponentsShowcase />

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