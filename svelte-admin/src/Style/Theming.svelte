<script>
  import { ButtonSet, Button } from 'carbon-components-svelte'
  import { Help, Reset, Save, TrashCan } from 'carbon-icons-svelte'
  import MainColumns from '../Layout/MainColumns.svelte'
  import ComponentsShowcase from './ComponentsShowcase.svelte'
  import StyleEditor from './StyleEditor.svelte'
  import { docsGo } from '../docs.js'
  import { BundleServer } from '../BundleServer.js'

  let currentStyleTokens = null

  const save = async () => {
    console.log("save", currentStyleTokens)
    //await BundleServer.saveStyleTokens(projectId, currentStyleTokens)
  }

  const reset = () => {
    currentStyleTokens = null
  }

</script>

<MainColumns
  sidebarLeftLabel="Themes"
  >

  <svelte:fragment slot="sidebarLeft">
    
  </svelte:fragment>

  <svelte:fragment slot="contentMain">
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
              iconDescription="Reset Changes"
              />
            <Button
              kind="ghost"
              icon={Reset}
              on:click={reset}
              iconDescription="Reset Changes"
              />
            <Button
              icon={Save}
              disabled={!currentStyleTokens}
              on:click={save}
              >
              Save
            </Button>
          </ButtonSet>      
      </div>
      <div class="main-content">

        <StyleEditor bind:currentStyleTokens />
        <ComponentsShowcase {currentStyleTokens} />
      </div>

    </div>  
  </svelte:fragment>
</MainColumns>

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