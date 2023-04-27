<script>
  import { push, replace } from 'svelte-spa-router';
  import { onMount, onDestroy } from 'svelte'

  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import ProjectWorkspace from './ProjectWorkspace.svelte'
  import SecondaryTabsContent from "./SecondaryTabsContent.svelte";
  import Logout from './Logout.svelte';
  import DataTablePaginationAutofit from './DataTablePaginationAutofit.svelte'

  import { 
    Grid,
    Row,
    Column,
    UnorderedList,
    ListItem,
    Loading,
    Tile,
    DataTable,
    Toolbar,
    ToolbarContent,
    Link,
    Button,
    ButtonSet,
    TextInput,
    Form,
    Dropdown,
    FormGroup,
    Tag,
    OverflowMenu,
    OverflowMenuItem
  } from "carbon-components-svelte";

  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import QID from 'carbon-icons-svelte/lib/QID.svelte'
  import Template from 'carbon-icons-svelte/lib/Template.svelte'
  import WatsonHealthThumbnailPreview from 'carbon-icons-svelte/lib/WatsonHealthThumbnailPreview.svelte'
  import { currentProject, secondaryTabPreviewProjectId } from './admin.js'

  export let params = {}

  let userId = InterkitClient.userId;

  let userIsRole = InterkitClient.userIsRole

  let projectsListSub;

  let previewUserAuth;

  let projects;
  let newProjectName;
  let gitRepository;
  let newProjectTemplateIndex = 0
  let newProjectItems = [
    { id: "starter", text: "Empty" },
    { id: "chat", text: "Chat example" },
    { id: "list", text: "List example" },
  ]

  const manageProjectsSub = async (projectId)=>{
    console.log("project subscription " + projectId)
    if (projectId) {
      if (projectsListSub) { projectsListSub.stop() }
    } else {
      projectsListSub = await InterkitClient.getSub('projects', 'projects.list') 
      projects = projectsListSub.data;
    }
  }

  const createProject = async () => {
    await InterkitClient.call("project.create", {
      name: newProjectName, 
      template: newProjectItems[newProjectTemplateIndex].id,
      gitRepository,

    })
    newProjectName = null;
  }

  onDestroy(() => {
    projectsListSub?.stop()
  })

  $: currentProjectId = params.projectId
  $: tab = params.tab

  $: manageProjectsSub(currentProjectId)

  // add "id" for carbon table
  $: projectRows = projects ? $projects
    .map( p => ({...p, id: p.id, createdAt: getCreatedDate(p)})) : []
    .sort( (p1,p2) => p1-p2)

  const openProject = id => push('/' + id)

  const previewProject = id => secondaryTabPreviewProjectId.set(id)
    
  const removeProject = async (projectId) => {
    if(confirm("really delete project?")) {
      await InterkitClient.call("project.remove", {projectId})
    }
  }

  const renameProject = async (row) => {
    let newName = prompt("Projekt umbenennen", row.name)
    if(newName) {
      await InterkitClient.call("project.rename", {projectId: row._id, newName});
    }
  }

  const duplicateProject = async (projectId) => {
    console.log("duplicating database")
    const newProjectId = await InterkitClient.call("project.duplicate", {projectId})
  }

  const updateProjectSetIsTemplate = async (row, isTemplate) => {
    await InterkitClient.call('project.setIsTemplate', { projectId: row._id, isTemplate })
  }

  const getCreatedDate = project => {
    return (project?.history || []).find(h => h.event == "create_project")?.date
  }

  let sortKey = 'createdAt'
  let sortDirection = 'descending'
  let pageSize = 10
  let page = 1

  const dataTableOverheadHeight = 0 +
    48 + // header of outer UI
    68 + // DataTable title
    2 + // DataTable container padding top
    48 + // DataTable toolbar
    48 + // DataTable thead = 1 row height
    40 + // DataTable tfoot
    24   // potential horizontal scrollbar + buffer

  const headers = [
    { key: 'name', value: 'Projects' },
    { key: 'createdAt', value: 'Created At', sort: (a, b) => new Date(a||0) - new Date(b||0), },
    { key: 'cpu', value: 'CPU usage' },
    { key: 'overflow', empty: true }
  ]

</script>

<Grid style="padding:0; height:100%; overflow-x: hidden; overflow-y: auto; max-width: none;">
  <Row>
    <Column lg="{16}">
      <div class="__ProjectWorkspace panes">
        <div class={`left-pane foo`} class:left-pane--has-current-project={!!currentProjectId}>
          {#if !currentProjectId}
            <DataTable
              style={`
                background: #f4f4f4;
                /* = pageSize * row + search/actions + thead + data table padding-top */
                min-height: ${(pageSize || 0) * 48 + 32 + 48 + 2 + 68}px;
              `}
              title="Your Projects"
              sortable
              {sortKey}
              {sortDirection}
              {pageSize}
              {page}
              {headers}
              rows={projectRows}
              >
              <Toolbar>
                <ToolbarContent>
                  <Button
                    size="small"
                    icon={Add}
                    >
                    Create project…
                  </Button>
                </ToolbarContent>
              </Toolbar>
              <span slot="cell" let:row let:cell>
                {#if cell.key === 'name'}
                  <span on:click={() => previewProject(row.id)} class="clickable">
                    {#if row.isTemplate}
                      <Tag>Template</Tag>
                    {/if}
                    {row.name}
                  </span>
                {/if}
                {#if cell.key === 'createdAt'}
                  <span class="clickable soft">
                    {#if row.createdAt}
                      {row.createdAt.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {:else}
                      -
                    {/if}
                  </span>
                {/if}
                {#if cell.key === 'cpu'}
                  {#if row.projectServer?.status === 'running' }
                    { (100 * row.projectServer?.cpu).toFixed(2) }%
                  {:else}
                    {row.projectServer?.status}
                  {/if}
                {/if}
                {#if cell.key === 'overflow'}
                  <ButtonSet>
                    <Button
                      kind="ghost"
                      size="small"
                      icon={Edit}
                      on:click={() => openProject(row.id)}
                      >Open</Button>
                    <Button
                      kind="ghost"
                      size="small"
                      icon={WatsonHealthThumbnailPreview}
                      on:click={() => previewProject(row.id)} 
                      >Preview</Button>
                    <OverflowMenu flipped>
                      <OverflowMenuItem
                        on:click={() => duplicateProject(row)}
                        ><Copy />&ensp;Duplicate</OverflowMenuItem>
                      <OverflowMenuItem
                        on:click={() => renameProject(row)}
                        ><QID />&ensp;Rename</OverflowMenuItem>
                      <OverflowMenuItem
                        danger
                        on:click={() => removeProject(row)}
                        ><TrashCan />&ensp;Delete</OverflowMenuItem>
                      {#if $userIsRole?.admin}
                        {#if row.isTemplate}
                          <OverflowMenuItem
                            danger
                            on:click={() => updateProjectSetIsTemplate(row, false)}
                            ><Template />&ensp;Unset&nbsp;template</OverflowMenuItem>
                        {:else}
                          <OverflowMenuItem
                            danger
                            on:click={() => updateProjectSetIsTemplate(row, true)}
                            ><Template />&ensp;Set&nbsp;template</OverflowMenuItem>
                        {/if}
                      {/if}
                    </OverflowMenu>
                  </ButtonSet>
                {/if}
              </span>
            </DataTable>
            <DataTablePaginationAutofit
              bind:pageSize
              bind:page
              totalItems={projectRows.length}
              overheadHeight={dataTableOverheadHeight}
              rowHeight={48}
              pageSizeAuto={true}
              />
            <Row>
              <div class="project-create-form">
                <Form>
                  <FormGroup legendText="New project" style="display: flex">
                    <TextInput 
                      bind:value={newProjectName} 
                      label="New project"
                      placeholder="Enter project title..."
                    />
                    <!--Dropdown
                      hideLabel
                      inline
                      titleText="Template"
                      placeholder="Select template"
                      bind:selectedIndex={newProjectTemplateIndex}
                      items={newProjectItems}
                    /-->
                    <TextInput 
                      bind:value={gitRepository} 
                      label="Public Git Repository"
                      placeholder="optional: Git Repository URL"
                    />
                    <Button 
                      size="field"
                      on:click={createProject}
                      >
                      create project
                    </Button>
                  </FormGroup>
                </Form>
              </div>
            </Row>
          {:else}
            {#if $currentProject}
              <ProjectWorkspace 
                {tab} 
                projectId={currentProjectId} 
                {currentProject}
                updatePreviewUserAuth={data => { previewUserAuth = data; }}
                />
            {:else}
              <Loading style="background-color:white"/>
            {/if}
          {/if}
        </div>
        <SecondaryTabsContent projectId={currentProjectId} {currentProject} {previewUserAuth} />
      </div>
    </Column>
  </Row>
</Grid>

<style>
  .project-create-form {
    margin-top: 10px;
    margin-left: 15px;
    padding: 15px;
  }

  .logout {
    padding: 15px;
  }

  .actions {
    text-align: right;
  }
  .clickable {
    padding: 0 0.5em;
  }
  .clickable:hover {
    cursor: pointer;
  }
  .soft {
    color: grey;
  }

  .panes {
    display: flex;
    height: 100%;
    height: var(--content-height);
  }
  .left-pane {
    flex: 1;
    height: 100%;
    /*overflow-x: auto;*/
    overflow-y: hidden; /* avoid stray vertical scrollbar */
  }
  .left-pane--has-current-project > :global(div.active) {
    display: block;
    flex: 1;
    height: 100%;
  }
  .left-pane--has-current-project > :global(div:not(.active)) {
    display: none;
  }

</style>
