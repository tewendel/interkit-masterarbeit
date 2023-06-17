<script>
  import { ButtonSet, Button, InlineNotification } from 'carbon-components-svelte'
  import { Help, Reset, Save, TrashCan } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject } from '../admin.js'

  let originalStyleTokens = $currentProject.uiState.styleTokens
  let modified = false
  let equalsDefaults = true
  let currentStyleTokens = {...originalStyleTokens}

  const save = async () => {
    console.log("save", currentStyleTokens)
    await BundleServer.saveSrcFile({
      projectId: $projectId,
      file: {
        filename: 'styleTokens.json',
        content: JSON.stringify(currentStyleTokens)
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

  // update style tokens from project if they differ
  $: if (!equals($currentProject.uiState.styleTokens,originalStyleTokens)) originalStyleTokens = $currentProject.uiState.styleTokens
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
        on:click={() => docsGo('/basics/interface_overview#style')}
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
        icon={Reset}
        on:click={reset}
        iconDescription="Undo Changes"
        />
      <Button
        icon={Save}
        disabled={!modified}
        on:click={save}
        >
        Save
      </Button>
    </ButtonSet>      
  </div>
  <div class="main-content">

    {#if originalStyleIsEmpty}
      <InlineNotification
        hideCloseButton
        kind="info-square"
        title="Default Style"
        subtitle="This project uses the default interkit style"
      />
    {:else}
      {#if equalsDefaults}
        <InlineNotification
          hideCloseButton
          kind="info-square"
          title="Default Style"
          subtitle="This project uses it's own styles, but they are equal to the interkit defaults"
        />
      {:else}
        <InlineNotification
          hideCloseButton
          kind="success"
          title="Custom Style"
          subtitle="This project uses styles that differ from the interkit defaults"
        />
      {/if}
    {/if}

    <StyleTokensForm bind:value={currentStyleTokens} bind:equalsDefaults={equalsDefaults} />
    <br>
    <ComponentsShowcase {currentStyleTokens} />
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
</style>