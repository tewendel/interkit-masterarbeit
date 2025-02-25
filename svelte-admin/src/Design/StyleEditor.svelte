<script>
  import { ButtonSet, Button, InlineNotification, TextArea, Accordion, AccordionItem } from 'carbon-components-svelte'
  import { Help, Reset, Save, Undo, TrashCan, ViewMode_1, Copy } from 'carbon-icons-svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'
  import definitions from '../../../packages/interkit/components/styleTokensConfig.json'

  export let modalPanelRightOpenSet = () => {}
  export let currentStyleTokens

  let originalStyleTokens = $currentProject?.uiState?.styleTokens
  let initialStyleTokens = $currentProject?.uiState?.styleTokens
  let modified = false
  let equalsDefaults = true
  let cssText = ''

  $: {
    previewOverrideStyleTokens.set(currentStyleTokens)
  }

  const camelToKebab = str => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

  const generateCssFromTokens = (tokens) => {
    if (!tokens) return ''

    // Group tokens by category
    const tokensByCategory = definitions.reduce((acc, def) => {
      if (!acc[def.category]) {
        acc[def.category] = []
      }
      acc[def.category].push({
        key: def.key,
        cssKey: camelToKebab(def.key),
        value: tokens[def.key] || def.defaultValue,
        defaultValue: def.defaultValue,
        type: def.type
      })
      return acc
    }, {})

    // Generate CSS with category comments
    const cssSegments = []
    for (const [category, items] of Object.entries(tokensByCategory)) {
      cssSegments.push(`\n  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */`)
      for (const item of items) {
        const line = `  --${item.cssKey}: ${item.value};`
        if (item.value !== item.defaultValue) {
          cssSegments.push(`${line}  /* changed from default: ${item.defaultValue} */`)
        } else {
          cssSegments.push(line)
        }
      }
    }

    return `#Theming * {${cssSegments.join('\n')}\n}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cssText)
  }

  $: {
    cssText = generateCssFromTokens(currentStyleTokens)
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
      {#if modalPanelRightOpenSet}
      <Button
        icon={ViewMode_1}
        kind="ghost"
        iconDescription="Show Components preview"
        on:click={() => modalPanelRightOpenSet(true)}
        />
    {/if}
    </ButtonSet>      
  </div>
  <div class="main-content">
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
    <h4>
      Style Tokens
    </h4>
    <StyleTokensForm bind:value={currentStyleTokens} bind:equalsDefaults={equalsDefaults} />
    
    <div class="export-css">
      <h4>
        Generated CSS
      </h4>
      <div class="textarea-container">
        <TextArea
          hideLabel
          placeholder="CSS will be generated based on your style tokens"
          rows={15}
          value={cssText}
          readonly
        />
        <p class="helper-text">
          Use this CSS in 'global.css` to permanently override the values in a custom theme.
        </p>
        <Button 
          size="small"
          icon={Copy}
          iconDescription="Copy to clipboard"
          on:click={copyToClipboard}
        >
          Copy CSS
        </Button>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '@carbon/type';

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
    overflow-y: auto;
  }
  .export-css {
    margin-top: 2rem;
  }
  .textarea-container {
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  h4 {
    margin: 2rem 0 1rem;
  }
  .helper-text {
    @include type.type-style('helper-text-01');
    margin: 1rem 0;
  }
</style>
