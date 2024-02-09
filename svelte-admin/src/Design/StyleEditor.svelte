<script>
  import { ButtonSet, Button, InlineNotification } from 'carbon-components-svelte'
  import { Help, Reset, Save, Undo, TrashCan } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'

  let originalStyleTokens = $currentProject?.uiState?.styleTokens
  let initialStyleTokens = $currentProject?.uiState?.styleTokens
  let modified = false
  let equalsDefaults = true
  let currentStyleTokens = originalStyleTokens ? {...originalStyleTokens} : {}

  $: {
    previewOverrideStyleTokens.set(currentStyleTokens)
  }

  const save = async () => {
    console.log("save", currentStyleTokens)
    await BundleServer.saveSrcFile({
      projectId: $projectId,
      file: {
        filename: 'styleTokens.json',
        content: JSON.stringify(currentStyleTokens,null,2)
      }
    })
    originalStyleTokens = {...currentStyleTokens}
  }

  const trash = () => {
    currentStyleTokens = {}
    save()
  }

  const reset = () => {
    currentStyleTokens = originalStyleTokens
  }

  const equals = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  // update currentStyleTokens if they differ
  $: if (!initialStyleTokens && $currentProject?.uiState?.styleTokens) {
    currentStyleTokens = $currentProject?.uiState?.styleTokens
    initialStyleTokens = $currentProject?.uiState?.styleTokens
  }
  // update style tokens from project if they differ
  $: if (!equals($currentProject?.uiState?.styleTokens,originalStyleTokens)) originalStyleTokens = $currentProject?.uiState?.styleTokens
  // true when the project doesn't define it's own style tokens
  $: originalStyleIsEmpty = !originalStyleTokens || equals(originalStyleTokens,{})
  // true when there is something to save or to undo
  $: modified = !equals(currentStyleTokens, originalStyleTokens) && !equalsDefaults
  
</script>

<div class="main">
  <div class="main-header">

    <ButtonSet style="justify-content: end">
      <Button
        icon={Help}
        kind="ghost"
        on:click={() => docsGo('/guides/quick-start/styling')}
        >Help</Button>
      <Button
        kind="ghost"
        icon={TrashCan}
        disabled={originalStyleIsEmpty}
        on:click={trash}
        iconDescription="Reset project to default style"
        />
      <Button
        kind="ghost"
        disabled={!modified}
        icon={Undo}
        on:click={reset}
        iconDescription="Undo Changes"
        />
      <Button
        icon={Save}
        disabled={!modified || $currentProjectReadOnly}
        on:click={save}
        >
        Save
      </Button>
    </ButtonSet>      
  </div>
  <div class="main-content">
    <div class="split-container">
      <div class="split-top">

        {#if originalStyleIsEmpty}
          <InlineNotification
            hideCloseButton
            kind="info-square"
            title="Default Style"
            subtitle="This project uses the default values"
          />
        {:else}
          {#if equalsDefaults}
            <InlineNotification
              hideCloseButton
              kind="info-square"
              title="Default Style"
              subtitle="This project uses it's own style settings, but they are equal to the interkit defaults"
            />
          {:else}
            <InlineNotification
              hideCloseButton
              kind="success"
              title="Custom Style"
              subtitle="This project uses styles settings that differ from the interkit defaults"
            />
          {/if}
        {/if}

        <StyleTokensForm bind:value={currentStyleTokens} bind:equalsDefaults={equalsDefaults} />
      </div>
      <div class="split-bottom">
        <h4 class="split-bottom-header">
          Component Preview
        </h4>
        Note that <code>scale</code> will have no effect on this preview.<br/>
        <ComponentsShowcase {currentStyleTokens} />
      </div>
    </div>
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
  .main-header {
    padding-bottom: .5rem;
  }
  .main-content {
    flex: 1;
    padding: 0 .5rem;
    height: 100%;
    overflow: auto;
  }
  .split-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .split-top {
    flex: 1;
    overflow: auto;
  }
  .split-bottom {
    height:40%;
    overflow: auto;
    border-top: 1px solid black;
  }
  .split-bottom-header {
    margin: 0;
    padding: 0;
    padding-top: .5rem;
  }
</style>
