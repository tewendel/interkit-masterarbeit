<script>
  import { 
    Button,
    ButtonSet,
  } from 'carbon-components-svelte'
  import { Help, Reset, Save, Undo, TrashCan } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'
  import ThemeInfo from './ThemeInfo.svelte'
  
  
  export let themeSlug
  export let themesStore
  export let contentMain

  $: theme = $themesStore.find(t => t.slug == themeSlug)

  const applyTheme = async () => {
    await BundleServer.applyTheme({
      projectId: $projectId,
      themeSlug: themeSlug
    })
    contentMain = "installedTheme"
  }

</script>

<div class="main">
  <div class="main-header">

    

    <ButtonSet style="justify-content: end; align-items: center">

      <h5 style="flex:1; padding: 0 15px">
        {theme?.meta?.name || "<Untitled>"}
      </h5>

      <Button
        icon={Help}
        kind="ghost"
        size="field"
        on:click={() => docsGo('/guides/overview/interface_overview#style')}
        >Help
      </Button>

      <Button
        icon={Save}
        kind="primary"
        size="field"
        on:click={applyTheme}
        >Apply this skin
      </Button>

    </ButtonSet>      
  </div>
  <div class="main-content">
    
    <ThemeInfo {theme} />
    
  </div>
</div>

<style>
</style>
