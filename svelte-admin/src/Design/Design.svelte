<script>
    import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import { writable } from 'svelte/store'
  import { currentProject } from '../admin.js'
  import MainColumns from '../Layout/MainColumns.svelte'
  import StyleEditor from './StyleEditor.svelte'
  import ThemeEditor from './ThemeEditor.svelte'
  import ThemePreview from './ThemePreview.svelte'
  import DesignSidebar from './DesignSidebar.svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'

  let contentMain = "style"
  let themeSlug = null

  let subHandle;  
  let themesStore = writable([])
  let modalPanelRightOpenSet

  const startSub = async () => {
    subHandle = await InterkitClient.getSub('themes', 'themes', {});
    subHandle.data.subscribe((data) => {
      themesStore.set(data)
    })
  }

  onMount(async () => {
    await startSub()
  });

  onDestroy(() => {
    if (subHandle) subHandle.stop()
  });

  $: if (contentMain !== "style") modalPanelRightOpenSet?.(false)

  let currentStyleTokens = $currentProject?.uiState?.styleTokens || {}
</script>

<MainColumns
  sidebarLeftLabel="Design"
  modalPanelRightLabel="Component Preview"
  bind:modalPanelRightOpenSet
  >

  <svelte:fragment slot="sidebarLeft">
    <DesignSidebar bind:contentMain bind:themeSlug {themesStore} />
  </svelte:fragment>

  <svelte:fragment slot="contentMain">
    {#if contentMain === "installedTheme"}
      <ThemeEditor {themesStore} />
    {:else if contentMain === "theme"}
      <ThemePreview {themesStore} {themeSlug} bind:contentMain />
    {:else if contentMain === "style"}
      <StyleEditor bind:currentStyleTokens {modalPanelRightOpenSet} />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="modalPanelRight">
    {#if contentMain === "style"}
      <div class="component-preview">
        <p>Note that <code>scale</code> will have no effect on this preview.</p>
        <ComponentsShowcase {currentStyleTokens} />
      </div>
    {/if}
  </svelte:fragment>
</MainColumns>

<style>
  .component-preview {
    padding: 1rem;
  }
  .component-preview p {
    margin-bottom: 2rem;
    color: var(--cds-text-secondary);
  }
</style>