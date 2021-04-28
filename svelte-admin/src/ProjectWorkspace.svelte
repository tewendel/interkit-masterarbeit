<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import WorkArea from './WorkArea.svelte';
  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import Preview from './Preview.svelte'
  import BlocklyEditor from './BlocklyEditor.svelte'
  import RepositoryEditor from "./RepositoryEditor.svelte"
  import MediaManager from "./MediaManager.svelte"
  import ProjectEditor from "./ProjectEditor.svelte"
  import { InterkitClient } from 'interkit'


  export let projectId
  export let currentProject
  
  let selected

  let rightPaneHidden = false;
  const toggleRightPane = () => rightPaneHidden = !rightPaneHidden;

</script>

{#if $currentProject}
  <div class="panes">
    <div class="left-pane">
      <Tabs type="container" bind:selected>
        <Tab label="Database" />
        <Tab label="Media" />
        <Tab label="Components" />
        <Tab label="Repo" />
        <Tab label="Project" />
        <div slot="content">
          <TabContent>
            <Sheets {projectId}/>
          </TabContent>
          <TabContent>
            <MediaManager {projectId} />
          </TabContent>
          <TabContent>
            <BlocklyEditor {projectId} open={selected === 2}/>
          </TabContent>
          <TabContent>
            <RepositoryEditor {projectId} />
          </TabContent>
          <TabContent>
            <ProjectEditor {projectId} />
          </TabContent>
        </div>
      </Tabs>
    </div>
    {#if rightPaneHidden}
      <button class="toggle-right" on:click={toggleRightPane}>show preview</button>
    {/if}
    <div class="right-pane" class:hidden={rightPaneHidden}>
        <button on:click={toggleRightPane}>hide preview</button>
        <Preview {projectId}/>
    </div>
  </div>
{:else}
  loading...
{/if}


<style>

  h1 {
    margin-bottom: 10px;
  }
  .panes {
    display: flex;
  }
  .left-pane {
    flex: 1;
    overflow-x: auto;
  }

  .right-pane {
    flex: 0.5;
    min-width: 320px;
  }

  .toggle-right {
    position: fixed;
    right: 50px;
    top: 50px;
  }

  div.hidden {
    display: none;
  }
</style>
