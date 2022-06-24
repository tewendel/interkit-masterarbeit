<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import WorkArea from './WorkArea.svelte';
  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import Preview from './Preview.svelte'
  import BlocklyEditor from './BlocklyEditor.svelte'
  import RepositoryTab from "./RepositoryTab.svelte"
  import MediaManager from "./MediaManager.svelte"
  import ProjectEditor from "./ProjectEditor.svelte"
  import UsersManager from './UsersManager.svelte'
  import MessagesManager from './MessagesManager.svelte'
  import ScheduledeventsManager from './ScheduledeventsManager.svelte'
  import NodeEditor from './NodeEditor.svelte'
  import { InterkitClient } from 'interkit'


  export let projectId
  export let currentProject
  
  let selected
  let repoNotice
  let editorFilesKey = "init"

  let rightPaneHidden = false;
  const toggleRightPane = () => rightPaneHidden = !rightPaneHidden;

  let previewUserId

  let nodeEditorBoardId
  let nodeEditorNodeId

  window.addEventListener('message', evt => {
    // console.log('received postMessage from iframe', evt, evt.data)
    if (evt.data && evt.data.userId) previewUserId = evt.data.userId
  })

  $: {
    const unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
    repoNotice = unstagedFiles.length > 0 ? `(${unstagedFiles.length})` : ""
  }

  let messagesListNotification
  let scheduledeventsListNotification

</script>

{#if $currentProject}
  <div class="panes">
    <div class="left-pane">
      <Tabs type="container" bind:selected>
        <Tab label="Database" />
        <Tab label="Media" />
        <Tab label="Components" />
        <Tab label="Chat" />
        <Tab label="Project" />
        <Tab label="Users" />
        <Tab label={`${messagesListNotification ? '‼️ ' : ''}Messages`} />
        <Tab label={'Schedule' + (scheduledeventsListNotification ? ` (${scheduledeventsListNotification})` : '')} />
        <Tab label={ "Repository " + repoNotice } />
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
            <NodeEditor
              on:nodeselected={(evt) => { nodeEditorBoardId = evt.detail.boardId; nodeEditorNodeId = evt.detail.nodeId }}
              {projectId}
              {previewUserId}
              />
          </TabContent>
          <TabContent>
            <ProjectEditor {projectId} {currentProject} />
          </TabContent>
          <TabContent>
            <UsersManager
              {projectId}
              {previewUserId}
              moveToBoardId={nodeEditorBoardId}
              moveToNodeId={nodeEditorNodeId}
              />
          </TabContent>
          <TabContent>
            <MessagesManager
              {projectId}
              bind:notification={messagesListNotification}
              />
          </TabContent>
          <TabContent>
            <ScheduledeventsManager
              {projectId}
              bind:notification={scheduledeventsListNotification}
              />
          </TabContent>
          <TabContent>
            <RepositoryTab {projectId} {currentProject} open={selected === 3}/>
          </TabContent>
          
        </div>
      </Tabs>
    </div>
    {#if rightPaneHidden}
      <button class="toggle-right" on:click={toggleRightPane}>show preview</button>
    {/if}
    <div class="right-pane" class:hidden={rightPaneHidden}>
        <button on:click={toggleRightPane}>hide preview</button>
        <Preview {projectId} {currentProject}/>
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
