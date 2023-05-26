<script>
  import {
    Tabs,
    Tab,
    TabContent,
    Button,
    ButtonSet
  } from "carbon-components-svelte";
  import { onDestroy } from 'svelte';

  import Information from 'carbon-icons-svelte/lib/Information.svelte'
  import OpenPanelFilledRight from 'carbon-icons-svelte/lib/OpenPanelFilledRight.svelte'

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

  import {
    currentProject,
    secondaryTabIndex,
    secondaryTabSpecialDoc,
    secondaryTabPreviewProjectId
  } from './admin.js'
  
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

  const info = file => {
    secondaryTabIndex.set(1)
    secondaryTabSpecialDoc.set($currentProject.uiState.metafile[file].html)
  }

  onDestroy(() => {
    console.log("destroying ProjectWorkspace")
    window.removeEventListener('message', messageListener)
  });

</script>

<!-- start -->
<div class="scrollable" class:active={!tab}>
  <div class="ProjectDashboard markdownContent">
    <ButtonSet style="justify-content: end">
      <!--Button
        kind="tertiary"
        size="small"
        on:click={() => info('readme')}
        icon={Information}
        disabled={!$currentProject?.uiState?.metafile?.readme?.html}
        >
        Show Readme
      </Button-->
      {#if $currentProject?.uiState?.metafile?.project?.html}
        <Button
          kind="ghost"
          size="field"
          on:click={() => info('project')}
          style="max-width: none; margin-left: 1px"
          icon={OpenPanelFilledRight}
          disabled={!$currentProject?.uiState?.metafile?.project?.html}
          >
          Show this text on the right
        </Button>
      {/if}
    </ButtonSet>
    <div class="content">
      {#if $currentProject?.uiState?.metafile?.project?.html}
        {@html $currentProject?.uiState?.metafile?.project?.html}
      {:else}
        <h1>
        Welcome to {$currentProject.name}
        </h1>
        This project/template does not provide an information file (project.md).
      {/if}
    </div>
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
  <BlocklyEditor {projectId} open={tab == 'components'}/>
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

