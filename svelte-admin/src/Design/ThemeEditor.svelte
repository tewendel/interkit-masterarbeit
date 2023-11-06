<script>
  import { 
    InlineNotification,
    Button,
    ButtonSet,
    CodeSnippet,
  } from 'carbon-components-svelte'
  import { Help, Reset, Save, Undo, TrashCan } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'
  import ThemeInfo from './ThemeInfo.svelte'
  

  export let themesStore

  $: theme = $currentProject?.uiState?.installedTheme

  const removeTheme = async () => {
    await BundleServer.removeTheme({
      projectId: $projectId,
    })
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
        kind="danger"
        size="field"
        disabled={!theme && !$currentProject?.uiState?.globalCssContent}
        on:click={removeTheme}
        >Remove
      </Button>

    </ButtonSet>      
  </div>
  <div class="main-content">
    
    {#if theme?.meta} 
    
      <InlineNotification
        hideCloseButton
        kind="info-square"
        title="Custom Skin"
        subtitle="This project uses a skin."
      />

    {:else}

      {#if $currentProject?.uiState?.globalCssContent }

        <InlineNotification
            hideCloseButton
            kind="info-square"
            title="Custom CSS"
            subtitle="This project uses custom CSS, but there is no description. You can change the skin by editing the file static/theme/global.css directly"
          />

          <InlineNotification
            hideCloseButton
            kind="warning"
            title="Modification warning"
            subtitle="If you apply another skin or remove this skin, it may be lost forever. Please do a commit in the repository tab before making any changes"
          />

          <h4>global.css</h4>
        <CodeSnippet 
        description="x"
          type="multi" 
          showMoreLess 
          hideCopyButton 
          wrapText  
          code={$currentProject?.uiState?.globalCssContent}
        />
          
      {:else}

        <InlineNotification
          hideCloseButton
          kind="info-square"
          title="Empty"
          subtitle="There is no extra CSS or skin in this project."
        />

      {/if}

    {/if}


  <ThemeInfo {theme} />
    
  </div>
</div>

<style>

</style>
