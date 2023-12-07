<script>
  import MainColumns from '../Layout/MainColumns.svelte'
  import ProjectTabSidebar from './ProjectTabSidebar.svelte'

  export let tab

</script>

<MainColumns sidebarLeftLabel="Project">
  <div slot="sidebarLeft">
    <ProjectTabSidebar contentMain={tab}/>
  </div>
  <div slot="contentMain">
    <slot />
  </div>
</MainColumns>
