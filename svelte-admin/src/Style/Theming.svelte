<script>
    import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import { writable } from 'svelte/store'
  import MainColumns from '../Layout/MainColumns.svelte'
  import StyleEditor from './StyleEditor.svelte'
  import ThemeEditor from './ThemeEditor.svelte'
  import DesignSidebar from './DesignSidebar.svelte'

  let contentMain = "style"
  let themeSlug = null

  let subHandle;  
  let themesStore = writable([])

  const startSub = async () => {
    subHandle = await InterkitClient.getSub('themes', 'themes', {});
    subHandle.data.subscribe((data) => {
      themesStore.set(data)
      console.log("themes sub", data)
    })
  }

  onMount(async () => {
    await startSub()
  });

  onDestroy(() => {
    if (subHandle) subHandle.stop()
  });
</script>

<MainColumns
  sidebarLeftLabel="Design"
  >

  <svelte:fragment slot="sidebarLeft">
    
    <DesignSidebar bind:contentMain bind:themeSlug {themesStore} />
    
  </svelte:fragment>

  <svelte:fragment slot="contentMain">
    {#if contentMain === "style"}
      <StyleEditor />
    {:else if contentMain === "theme"}
      <ThemeEditor {themesStore} {themeSlug} />
    {/if}
  </svelte:fragment>
</MainColumns>

<style>
</style>