<script>
  import MainColumns from '../Layout/MainColumns.svelte'
  import ProjectTabSidebar from './ProjectTabSidebar.svelte'

  export let tab

</script>

<MainColumns sidebarLeftLabel="Project">
  <div slot="sidebarLeft">
    <ProjectTabSidebar contentMain={tab}/>
  </div>
  <div slot="contentMain" class="content">
    <slot />
  </div>
</MainColumns>

<style>
  .content {
    height:100%;
    overflow: auto;
  }
</style>