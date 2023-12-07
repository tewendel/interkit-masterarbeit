<script context="module">
  import {
    currentProject,
    currentProjectReadOnly,
  } from '../admin.js'
  import { push, replace } from 'svelte-spa-router'
  import { get } from 'svelte/store'

  export const navigateTab = async (path, pathReplace=false) => {
    console.log("navigateTab", path)
    if(path != undefined) {
      const project = await get(currentProject)
      console.log("navigate", path)
      const nav = pathReplace ? replace : push
      if(get(currentProjectReadOnly)) {
        nav(`/template/${project.slug}/${path}`);
      } else {
        nav(`/project/${project.id}/${path}`);
      }
    }
  }
</script>

<script>
  import { onDestroy } from 'svelte';

  import ProjectDashboard from '../Project/ProjectDashboard.svelte'
  import ProjectTab from '../Project/ProjectTab.svelte'
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
<div class="scrollable" class:active={[null, 'project', 'users', 'repository', 'schedule', 'messages'].includes(tab)}>
  <ProjectTab {projectId} {tab}>

    <!-- start -->
    <div class="scrollable main" class:active={tab == null}>
      <ProjectDashboard {projectId} />
    </div>

    <!-- project -->
    <div class="scrollable padding main" class:active={tab == 'project'}>
      <ProjectEditor {projectId} {currentProject} />
    </div>

    <!-- users -->
    <div class="scrollable main" class:active={tab == 'users'}>
      <UsersManager
      {projectId}
      {previewUserId}
      {updatePreviewUserAuth}
      moveToBoardId={nodeEditorBoardId}
      moveToNodeId={nodeEditorNodeId}
      />
    </div>

    <!-- messages -->
    <div class="scrollable main" class:active={tab == 'messages'}>
      <MessagesManager
        {projectId}
      />
    </div>

    <!-- scheduler -->
    <div class="scrollable main" class:active={tab == 'schedule'}>
      <ScheduledeventsManager
      {projectId}
      bind:notification={scheduledeventsListNotification}
      />
    </div>

    <!-- repository -->
    <div class="scrollable main" class:active={tab == 'repository'}>
      <RepositoryTab {projectId} {currentProject} />
    </div>

  </ProjectTab>
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
  {#key projectId}
    <BlocklyEditor {projectId} open={tab == 'app'}/>
  {/key}
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

<style>

  .scrollable {
    overflow-x: auto;
    overflow-y: auto;
  }

  .main:not(.active) {
    display: none;
  }

  .padding {
    padding: 1rem;
  }

</style>

