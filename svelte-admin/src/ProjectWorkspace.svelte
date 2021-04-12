<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import WorkArea from './WorkArea.svelte';
  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import Preview from './Preview.svelte'
  import BlocklyEditor from './BlocklyEditor.svelte'
  import RepositoryEditor from "./RepositoryEditor.svelte"
  import MediaManager from "./MediaManager.svelte"
  import { InterkitClient } from 'interkit'


  export let projectId
  export let currentProject
  export let selected

</script>

{#if $currentProject}
  <div class="panes">
    <div class="left-pane">
      <Tabs type="container" bind:selected>
        <Tab label="Database" />
        <Tab label="Components" />
        <Tab label="Repo" />
        <Tab label="Media" />
        <div slot="content">
          <TabContent>
            <Sheets {projectId}/>
          </TabContent>
          <TabContent>
            <BlocklyEditor {projectId} open={selected === 1}/>
          </TabContent>
          <TabContent>
            <RepositoryEditor {projectId} />
          </TabContent>
          <TabContent>
            <MediaManager {projectId} />
          </TabContent>
        </div>
      </Tabs>
    </div>
    <div class="right-pane">
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
  }

  .right-pane {
    flex: 0.5;
    min-width: 320px;
  }
</style>
