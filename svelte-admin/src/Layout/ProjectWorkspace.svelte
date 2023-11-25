<script>


  import { onDestroy } from 'svelte';

  import ProjectDashboard from '../Project/ProjectDashboard.svelte'
  import Sheets from '../Data/Sheets.svelte'
  import BlocklyEditor from '../App/BlocklyEditor.svelte'
  import RepositoryTab from "../Project/RepositoryTab.svelte"
  import MediaManager from "../Media/MediaManager.svelte"
  import ProjectEditor from "../Project/ProjectEditor.svelte"
  import UsersManager from '../User/UsersManager.svelte'
  import MessagesManager from '../Messages/MessagesManager.svelte'
  import ScheduledeventsManager from '../Project/ScheduledeventsManager.svelte'
  import NodeEditor from '../Story/NodeEditor.svelte'
  import Design from '../Design/Design.svelte'
  
  import {
    currentProject,
  } from '../admin.js'

  export let projectId
  export let tab
  export let updatePreviewUserAuth
  
  let selected
  let editorFilesKey = "init"

  let previewUserId
  let previewUserAuth

  let nodeEditorBoardId
  let nodeEditorNodeId

  let messageListener = window.addEventListener('message', evt => {
    // console.log('received postMessage from iframe', evt, evt.data)
    if (evt.data && evt.data.userId) previewUserId = evt.data.userId
  })

  let scheduledeventsListNotification



  onDestroy(() => {
    console.log("destroying ProjectWorkspace")
    window.removeEventListener('message', messageListener)
  });



</script>

<!-- start -->
<div class="scrollable" class:active={!tab}>
  <ProjectDashboard {projectId} />
</div>

<!-- sheets -->
<div class="scrollable" class:active={tab == 'data' }>
  <Sheets {projectId}/>
</div>

<!-- media -->
<div class="scrollable" class:active={tab == 'media' }>
  <MediaManager {projectId} />
</div>

<!-- components -->
<div class:active={tab == 'app'}>
  <BlocklyEditor {projectId} open={tab == 'app'}/>
</div>

<!-- theming -->
<div class="scrollable" class:active={tab == 'style' }>
  <Design />
</div>

<!-- nodes -->
<!-- FIXME height/max-height will have to be set to something like calc(100vh - var(--interkitadmin-header-height)) -->
<div style="height: 100%;" class:active={tab == 'story'}>
  <NodeEditor
  on:nodeselected={(evt) => { nodeEditorBoardId = evt.detail.boardId; nodeEditorNodeId = evt.detail.nodeId }}
  {projectId}
  {previewUserId}
  />
</div>

<!-- project -->
<div class="scrollable padding" class:active={tab == 'project'}>
  <ProjectEditor {projectId} {currentProject} />
</div>

<!-- users -->
<div class="scrollable" class:active={tab == 'users'}>
  <UsersManager
  {projectId}
  {previewUserId}
  {updatePreviewUserAuth}
  moveToBoardId={nodeEditorBoardId}
  moveToNodeId={nodeEditorNodeId}
  />
</div>

<!-- messages -->
<div class="scrollable" class:active={tab == 'messages'}>
  <MessagesManager
    {projectId}
  />
</div>

<!-- scheduler -->
<div class="scrollable" class:active={tab == 'schedule'}>
  <ScheduledeventsManager
  {projectId}
  bind:notification={scheduledeventsListNotification}
  />
</div>

<!-- repository -->
<div class="scrollable" class:active={tab == 'repository'}>
  <RepositoryTab {projectId} {currentProject} />
</div>

<style>

  h1 {
    margin-bottom: 10px;
  }

  .scrollable {
    overflow-x: auto;
    overflow-y: auto;
  }

  .content {
    padding: 0 1rem;
    margin: 1rem 0;
  }

  :global(.markdownContent h2) {
    margin-bottom: 0.25em;
    font-weight: bold;
  }
  
  :global(.markdownContent h4) {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  :global(.markdownContent ul) {
    list-style: disc;
    margin-left: 1em;
  }

  :global(.markdownContent li) {
    margin-bottom: 1em;

  }

</style>

