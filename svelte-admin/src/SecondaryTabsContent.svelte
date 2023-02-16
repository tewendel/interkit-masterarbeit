<script>

  import { Button } from 'carbon-components-svelte'
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte'
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte'
  
  import { secondaryTabsVisible } from './admin.js'

  import Preview from './Preview.svelte'
  import { secondaryTabIndex } from './admin';

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
    <Button
        kind="ghost"
        iconDescription={rightPaneHidden ? "maximize" : "minimize"}
        on:click={toggleRightPane}
        icon={rightPaneHidden ? Maximize : Minimize}
    />
    </div>
  <div class="right-pane-content" class:hidden={rightPaneHidden}>
    
    <div class="secondary-content-container">

      <section class:visible={$secondaryTabIndex == 0}>
        <Preview {projectId} {currentProject} {previewUserAuth}/>
      </section>
    
      <section class:visible={$secondaryTabIndex == 1}>
        <h2>docs</h2>
      </section>
    
      <section class:visible={$secondaryTabIndex == 2}>
        <h2>logs</h2>
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
  }

  .right-pane.minimized {
    max-width: var(--sidebarCollapsedWidth);
    padding: 0;
    height: 100vh;
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
    position: relative
  }

  section {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }

  section.visible {
    visibility: visible;
  }

  div.hidden {
    display: none;
  }



</style>