<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { onDestroy } from 'svelte';

  import WorkArea from './WorkArea.svelte';
  import Sheets from './Sheets.svelte'
  import ComponentEditor from './ComponentEditor.svelte'
  import BlocklyEditor from './BlocklyEditor.svelte'
  import RepositoryTab from "./RepositoryTab.svelte"
  import MediaManager from "./MediaManager.svelte"
  import ProjectEditor from "./ProjectEditor.svelte"
  import UsersManager from './UsersManager.svelte'
  import MessagesManager from './MessagesManager.svelte'
  import ScheduledeventsManager from './ScheduledeventsManager.svelte'
  import NodeEditor from './NodeEditor.svelte'

  export let projectId
  export let tab
  //export let currentProject
  export let updatePreviewUserAuth

  import { currentProject } from './admin.js'
  
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
<div class="scrollable padding" class:active={!tab}>
  <div class="ProjectDashboard">
  <h1>
  Welcome to {$currentProject.name}
  </h1>
  Navigate using the menu in the header.
  </div>
</div>

<!-- sheets -->
<div class="scrollable" class:active={tab == 'sheets' }>
  <Sheets {projectId}/>
</div>

<!-- media -->
<div class="scrollable" class:active={tab == 'media' }>
  <MediaManager {projectId} />
</div>

<!-- components -->
<div class:active={tab == 'components'}>
  <BlocklyEditor {projectId} open={true}/>
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

  .padding {
    padding: 1rem;
  }

</style>

