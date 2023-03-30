<script>

  import { Button, ToastNotification } from 'carbon-components-svelte'
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte'
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte'
  
  import { secondaryTabsVisible, secondaryTabIndex } from './admin.js'

  import Preview from './Preview.svelte'
  import DocsBrowser from '../DocsBrowser.svelte'
  import ProjectServerInfo from './ProjectServerInfo.svelte';

  export let projectId;
  export let currentProject;
  export let previewUserAuth;

  let rightPaneHidden = false;
  const toggleRightPane = () => {
    rightPaneHidden = !rightPaneHidden;
    secondaryTabsVisible.set(!rightPaneHidden);
  }


</script>

<div class="right-pane" class:minimized={rightPaneHidden}>        
  <div class="pane-controls">
    <!-- \u00ad is a soft hyphens so the word breaks nicely to fit in minimized, narrow sidebar -->
    <Button
      kind="ghost"
      iconDescription={rightPaneHidden ? "maxi\u00admize" : "minimize"}
      tooltipAlignment={rightPaneHidden ? "center" : "end"}
      on:click={toggleRightPane}
      icon={rightPaneHidden ? Maximize : Minimize}
      />
    </div>
  <div class="right-pane-content" class:hidden={rightPaneHidden}>
    
    <div class="secondary-content-container">

      <section class:visible={$secondaryTabIndex == 0}>
        {#if $currentProject}
          <Preview {projectId} {currentProject} {previewUserAuth}/>
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
    
      <section class:visible={$secondaryTabIndex == 1}>
        <DocsBrowser/>
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
    flex: 0.5;    
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
  }


  .secondary-content-container {
    position: relative;
  }

  section {
    width: 100%;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    /*border: 2px solid blue;*/
  }

  section.visible {
    visibility: visible;
  }

  div.hidden {
    display: none;
  }



</style>
