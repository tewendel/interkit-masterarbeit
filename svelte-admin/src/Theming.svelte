<script>
  import MainColumns from './MainColumns.svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
</script>

<MainColumns
  sidebarLeftLabel="Themes"
  >

  <svelte:fragment slot="sidebarLeft">
    left
  </svelte:fragment>
   
  <svelte:fragment slot="contentMain">
    <div class="__">
      
      <ComponentsShowcase />

    </div>  
  </svelte:fragment>
</MainColumns>