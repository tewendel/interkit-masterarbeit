<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { onDestroy } from 'svelte';

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
  export let tab
  export let currentProject
  
  let selected
  let repoNotice
  let editorFilesKey = "init"

  let rightPaneHidden = false;
  const toggleRightPane = () => rightPaneHidden = !rightPaneHidden;

  let previewUserId
  let previewUserAuth

  let nodeEditorBoardId
  let nodeEditorNodeId

  let messageListener = window.addEventListener('message', evt => {
    // console.log('received postMessage from iframe', evt, evt.data)
    if (evt.data && evt.data.userId) previewUserId = evt.data.userId
  })

  $: {
    const unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
    repoNotice = unstagedFiles.length > 0 ? `(${unstagedFiles.length})` : ""
  }

  let messagesListNotification
  let scheduledeventsListNotification

  onDestroy(() => {
    console.log("destroying ProjectWorkspace")
    window.removeEventListener('message', messageListener)
  });

</script>

{#if $currentProject}
  <div class="__ProjectWorkspace panes">
    <div class="left-pane">
      
      <!-- start -->
      <div class:active={!tab}>
        <h1>
        Welcome to project {projectId}
        </h1>
      </div>

      <!-- sheets -->
      <div class:active={tab == 'sheets' }>
        <Sheets {projectId}/>
      </div>
      
      <!-- media -->
      <div class:active={tab == 'media' }>
        <MediaManager {projectId} />
      </div>
      
      <!-- components -->
      <div class:active={tab == 'components'}>
        <BlocklyEditor {projectId} open={true}/>
      </div>
      
      <!-- nodes -->
      <!-- FIXME height/max-height will have to be set to something like calc(100vh - var(--interkitadmin-header-height)) -->
      <div style="height: 100%; max-height: 70vh" class:active={tab == 'story'}>
        <NodeEditor
        on:nodeselected={(evt) => { nodeEditorBoardId = evt.detail.boardId; nodeEditorNodeId = evt.detail.nodeId }}
        {projectId}
        {previewUserId}
        />
      </div>
      
      <!-- project -->
      <div class:active={tab == 'project'}>
        <ProjectEditor {projectId} {currentProject} />
      </div>
      
      <!-- users -->
      <div class:active={tab == 'users'}>
        <UsersManager
        {projectId}
        {previewUserId}
        updatePreviewUserAuth={(data)=>previewUserAuth = data}
        moveToBoardId={nodeEditorBoardId}
        moveToNodeId={nodeEditorNodeId}
        />
      </div>
      
      <!-- messages -->
      <div class:active={tab == 'messages'}>
        <MessagesManager
        {projectId}
        bind:notification={messagesListNotification}
        />
      </div>
      
      <!-- scheduler -->
      <div class:active={tab == 'schedule'}>
        <ScheduledeventsManager
        {projectId}
        bind:notification={scheduledeventsListNotification}
        />
      </div>
      
      <!-- repository -->
      <div class:active={tab == 'repository'}>
        <RepositoryTab {projectId} {currentProject} />
      </div>

    </div>
    {#if rightPaneHidden}
      <button class="toggle-right" on:click={toggleRightPane}>show preview</button>
    {/if}
    <div class="right-pane" class:hidden={rightPaneHidden}>
        <button on:click={toggleRightPane}>hide preview</button>
        <Preview {projectId} {currentProject} {previewUserAuth}/>
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
    height: 100%;
  }
  .left-pane {
    flex: 1;
    /*overflow-x: auto;*/
  }

  .right-pane {
    flex: 0.5;
    min-width: 320px;
    max-width: 550px;
  }

  .toggle-right {
    position: fixed;
    right: 50px;
    top: 50px;
  }

  div.hidden {
    display: none;
  }

  .content {
    height: calc(100% - 48px); /* only give content the height without tab bar */
  }

  :global(.__ProjectWorkspace .bx--tab-content) {
    height: 100%
  }
  .left-pane > div.active {
    display: block;
    flex:1;
  }
  .left-pane > div:not(.active) {
    display: none;
  }
</style>
