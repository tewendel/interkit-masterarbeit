<script>

  import { get } from 'svelte/store'

  import {
    Button,
    ButtonSet,
    ToastNotification
  } from 'carbon-components-svelte'

  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte'
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte'
  // import PageFirst from 'carbon-icons-svelte/lib/PageFirst.svelte'
  // import PageLast from 'carbon-icons-svelte/lib/PageLast.svelte'
  import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte'
  
  import {
    projectId,
    currentProject,
    secondaryTabsHidden,
    secondaryTabsMinimized,
    secondaryTabIndex,
    secondaryTabSpecialDoc,
    secondaryTabPreviewProjectId
  } from './admin.js'

  import Preview from './Preview.svelte'
  import DocsBrowser from './DocsBrowser.svelte'
  import ProjectServerInfo from './ProjectServerInfo.svelte'

  export let previewUserAuth

  const toggleRightPane = () => {
    const was = get(secondaryTabsMinimized)
    secondaryTabsMinimized.set(!was)
    secondaryTabsHidden.set(!was)
  }

</script>

<div class="right-pane" class:minimized={$secondaryTabsMinimized}>
  <div class="pane-controls">
    <ButtonSet>
      {#if $secondaryTabIndex}
        {#if $secondaryTabSpecialDoc}
          <Button
            kind="ghost"
            on:click={() => { secondaryTabSpecialDoc.set(false) }}
            icon={ChevronLeft}
            >
            back&nbsp;to&nbsp;docs
          </Button>
        {:else}
          <!--
          <Button
            kind="ghost"
            on:click={() => { secondaryTabSpecialDoc.set(true) }}
            icon={PageLast}
            >project docs
          </Button>
          -->
        {/if}
      {/if}
    <!-- \u00ad is a soft hyphens so the word breaks nicely to fit in minimized, narrow sidebar -->
    <Button
      kind="ghost"
      iconDescription={$secondaryTabsMinimized ? "maxi\u00admize" : "minimize"}
      tooltipAlignment={$secondaryTabsMinimized ? "center" : "end"}
      on:click={toggleRightPane}
      icon={$secondaryTabsMinimized ? Maximize : Minimize}
      />
    </ButtonSet>
  </div>
  <div
    class="right-pane-content"
    class:right-pane-content__padded={true}
    class:hidden={$secondaryTabsMinimized}
    >
    
    <div class="secondary-content-container">

      <section class:visible={$secondaryTabIndex == 0}>
        {#if $currentProject}
          <Preview projectId={$projectId} {previewUserAuth} appVariant="dev"/>
        {:else if $secondaryTabPreviewProjectId}
          <Preview projectId={$secondaryTabPreviewProjectId} appVariant="build"/>
        {:else}
          <!-- TODO find better component -->
          <ToastNotification
            kind="info"
            lowContrast
            hideCloseButton
            title="Preview"
            caption="Pick a project from the dashboard to preview it here."
            >
          </ToastNotification>
        {/if}
      </section>
    
      <section class:visible={$secondaryTabIndex == 1} class="right-pane-content-docs">
        <div
          class="right-pane-content-docs-special markdownContent"
          style={`display: ${$secondaryTabSpecialDoc ? 'block' : 'none'}`}
          >
          {@html $secondaryTabSpecialDoc}
        </div>
        <div style={`display: ${$secondaryTabSpecialDoc ? 'none' : 'block'}`}>
          <DocsBrowser />
        </div>
      </section>
    
      <section class:visible={$secondaryTabIndex == 2}>
        <h4> Project Server</h4>
        {#if $currentProject}
          <ProjectServerInfo {currentProject}/>
        {:else}
          no current project
        {/if}
      </section>
    
    </div>

  </div>
</div>

  

<style>

  .right-pane {
    flex-grow: 1;
    flex-shrink: 0;
    width: 33.3%;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-left: 1px solid #ccc;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .right-pane.minimized {
    max-width: var(--sidebarCollapsedWidth);
    padding: 0;
    /* if needed: should be calc(100vh - interkit header height) */
    /* height: 100vh; */
  }

  /* force tooltip to fit in narrow sidebar */
  .right-pane.minimized :global(.bx--assistive-text) {
    box-sizing: border-box;
    max-width: 100%;
    padding-left: 2px;
    padding-right: 2px;
  }

  .pane-controls {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  .right-pane-content {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-grow: 1;
  }

  .secondary-content-container {
    position: relative;
    height: 100%;
  }

  .right-pane-content-docs {
    margin-left: -1rem;
    width: calc(100% + 2rem);
  }

  section {
    width: 100%;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    /*border: 2px solid blue;*/
  }

  section.right-pane-content-docs {
    height: 100%;
  }

  .right-pane-content-docs-special {
    height: 100%;
    overflow: auto;
    padding: 1rem;
  }

  section.visible {
    visibility: visible;
    display: block;
  }

  div.hidden {
    display: none;
  }



</style>
