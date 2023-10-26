<script>
  import { 
    InlineNotification,
    Grid,
    Row,
    Column,
    Button,
    ButtonSet,
    TextInput,
    Form,
    FormGroup,
    InlineLoading,
    RadioTile,
    TileGroup,
    ProgressIndicator,
    ProgressStep,
    ImageLoader
  } from 'carbon-components-svelte'
  import { Help, Reset, Save, Undo, TrashCan } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'
  import marked from "marked"
  
  export let themeSlug
  export let themesStore

  $: theme = $themesStore.find(t => t.slug == themeSlug)

</script>

<div class="main">
  <div class="main-header">

    {theme?.meta?.name} (slug: {themeSlug})
    
    <ButtonSet style="justify-content: end">
      <Button
        icon={Help}
        kind="ghost"
        on:click={() => docsGo('/guides/overview/interface_overview#style')}
        >Help
      </Button>

    </ButtonSet>      
  </div>
  <div class="main-content">
    


  {@html marked(theme?.readme)}
    
  </div>
</div>

<style>

</style>
