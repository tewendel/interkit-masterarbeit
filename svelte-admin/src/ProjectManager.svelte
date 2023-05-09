<script>
  import { push, replace } from 'svelte-spa-router';
  import { onMount, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'

  import { InterkitClient } from 'interkit'
  import { bundleServerURL$ } from './BundleServer.js'

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
    OverflowMenuItem,
    RadioTile,
    TileGroup,
    ProgressIndicator,
    ProgressStep,
    ImageLoader
  } from "carbon-components-svelte";

  import Help from 'carbon-icons-svelte/lib/Help.svelte'
  import Information from 'carbon-icons-svelte/lib/Information.svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import QID from 'carbon-icons-svelte/lib/QID.svelte'
  import Template from 'carbon-icons-svelte/lib/Template.svelte'
  import WatsonHealthThumbnailPreview from 'carbon-icons-svelte/lib/WatsonHealthThumbnailPreview.svelte'
  import {
    currentProject,
    secondaryTabIndex,
    secondaryTabSpecialDoc,
    secondaryTabPreviewProjectId
  } from './admin.js'

  import { docsGo } from './docs.js'

  export let params = {}

  let createProjectStep = false
  let createProjectVariant
  let createProjectTemplate
  let createProjectGitRepo
  let createProjectName

  let specialDoc

  let userId = InterkitClient.userId;

  let userIsRole = InterkitClient.userIsRole

  let projectsListSub;

  let previewUserAuth;

  let projects;

  const bundleServerURL = bundleServerURL$

  const manageProjectsSub = async (projectId)=>{
    console.log("project subscription " + projectId)
    if (projectId) {
      if (projectsListSub) { projectsListSub.stop() }
    } else {
      projectsListSub = await InterkitClient.getSub('projects', 'projects.list') 
      projects = projectsListSub.data;
      projects = []
    }
  }

  const createProject = async () => {
    let newProjectId
    switch (createProjectVariant) {
      case 'Template':
        newProjectId = await InterkitClient.call("project.duplicate", {
          projectId: createProjectTemplate.id,
          newProjectName: createProjectName
        })
        break
      case 'Empty':
        if (createProjectEmptyTemplate) {
          newProjectId = await InterkitClient.call("project.duplicate", {
            projectId: createProjectEmptyTemplate.id,
            newProjectName: createProjectName
          })
        } else {
          newProjectId = await InterkitClient.call("project.create", {
            name: createProjectName
          })
        }
        break
      case 'Import':
        newProjectId = await InterkitClient.call("project.create", {
          name: createProjectName,
          gitRepository: createProjectGitRepo
        })
    }
    createProjectStep = false
    if (!newProjectId) {
      window.alert('Something might have gone wrong. Please check the project list.')
    } else {
      push('/' + newProjectId)
    }
  }

  onDestroy(() => {
    projectsListSub?.stop()
  })

  $: currentProjectId = params.projectId
  $: tab = params.tab

  $: manageProjectsSub(currentProjectId)

  // add "id" for carbon table
  $: projectRows = projects
    ? $projects
      .map(p => ({ ...p, id: p.id, createdAt: getCreatedDate(p) }))
      // only admins can see templates in the project table
      .filter(p => $userIsRole?.admin === true || !p.isTemplate)
      .sort((p1, p2) => p1 - p2)
    : []

  let templates
  $: templates = projects
    ? $projects.filter(_ => _.isTemplate)
        .map(p => ({ ...p, id: p.id, createdAt: getCreatedDate(p) }))
    : []

  let createProjectEmptyTemplate
  $: createProjectEmptyTemplate = projectRows
    .filter(_ => _.isTemplate && (_.slug === 'empty' || _.name === 'empty'))?.[0]

  const openProject = id => push('/' + id)

  const infoProject = row => {
    specialDoc = row.uiState.metafile.readme.html
    secondaryTabIndex.set(1)
    secondaryTabSpecialDoc.set(true)
  }

  const previewProject = id => {
    secondaryTabIndex.set(0)
    secondaryTabPreviewProjectId.set(id)
  }
    
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
    { key: 'favicon', empty: true },
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
        <div class={`left-pane`} class:left-pane--has-current-project={!!currentProjectId}>
          {#if currentProjectId}
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
          {:else if createProjectStep === false}
            <DataTable
              style={`
                background: #f4f4f4;
                /* = pageSize * row + search/actions + thead + data table padding-top */
                min-height: ${(pageSize || 0) * 48 + 32 + 48 + 2 + 68}px;
              `}
              title="Projects on this server"
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
                    kind="ghost"
                    icon={Help}
                    on:click={() => docsGo('/basics/process')}
                    >
                    Help
                  </Button>
                  <Button
                    size="small"
                    icon={Add}
                    on:click={() => { createProjectStep = 0 }}
                    >
                    Create project…
                  </Button>
                </ToolbarContent>
              </Toolbar>
              <span slot="cell" let:row let:cell>
                {#if cell.key === 'favicon'}
                  {#if $bundleServerURL}
                    <ImageLoader
                      src={`${$bundleServerURL}/app/${row.id}/favicon.png`}
                      alt="Favicon"
                      fadeIn
                      style="width: 2em"
                      >
                      <svelte:fragment slot="error">
                      </svelte:fragment>
                    </ImageLoader>
                  {/if}
                {/if}
                {#if cell.key === 'name'}
                  <!--<span on:click={() => previewProject(row.id)} class="clickable">-->
                  <span>
                    {#if row.isTemplate}
                      <Tag>Template</Tag>
                    {/if}
                    {row.name}
                  </span>
                {/if}
                {#if cell.key === 'createdAt'}
                  <span class="soft">
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
                    {row.projectServer?.status || ''}
                  {/if}
                {/if}
                {#if cell.key === 'overflow'}
                  <ButtonSet>
                    <Button
                      kind="ghost"
                      size="small"
                      icon={Edit}
                      on:click={() => openProject(row.id)}
                      >Edit</Button>
                    <Button
                      kind="ghost"
                      size="small"
                      icon={Information}
                      disabled={!row.uiState?.metafile?.readme?.html}
                      on:click={() => infoProject(row)}
                      >Readme</Button>
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
                        on:click={() => removeProject(row.id)}
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
          {:else if createProjectStep !== false}
            <Grid>
              <Row padding style="max-height: var(--createwizard-header-height); overflow: hidden">
                <Column>
                  <h2 class="createwizard-heading">Create new project</h2>
                </Column>
              </Row>
              <Row padding>
                <!-- FIXME this won't scroll if there is too many templates -->
                <Column sm={3} md={5} style="max-height: calc(100vh - var(--header-height) - var(--createwizard-header-height)); overflow-y: auto">
                  {#if createProjectStep === 0}
                    <TileGroup
                      legend="Pick a variant to continue."
                      bind:selected={createProjectVariant}
                      >
                      <RadioTile value="Template" disabled={!templates || !templates.length}>
                        <h3>Template</h3>
                        {#if !templates || !templates.length}
                          <p>Error: No templates found!</p>
                          {#if $userIsRole?.admin}
                            <p>
                              As an admin, you can turn projects into templates.<br/>
                              Go back (cancel), and use a project's &#8942; menu.
                            </p>
                          {:else}
                            <p>Please ask your admin!</p>
                          {/if}
                        {:else}
                          <p>
                            Select a template in the next step.<br/>
                            <Information /> If you're not sure, pick this option.
                          </p>
                        {/if}
                      </RadioTile>
                      <RadioTile value="Empty">
                        <h3>Empty</h3>
                        <p>Start with an empty project.</p>
                      </RadioTile>
                      <RadioTile value="Import">
                        <h3>Import</h3>
                        <p>Upload a project file or use a repository from Github/Gitlab.</p>
                      </RadioTile>
                    </TileGroup>
                  {:else if createProjectStep === 1 && createProjectVariant === 'Template'}
                    {#if !templates || !templates.length}
                      <p>No templates found!</p>
                    {/if}
                    <TileGroup
                      bind:selected={createProjectTemplate}
                      legend="Click on a template title to select it."
                      >
                      {#each templates as template}
                        <RadioTile value={template}>
                          <h3 style="margin-bottom: 1rem">{template.name}</h3>
                          {#if template.uiState?.metafile?.description?.html}
                            <div style="margin: 1rem 0">
                              {@html template.uiState.metafile.description.html}
                            </div>
                          {/if}
                          {#if template.createdAt}
                            <p style="margin-bottom: 1rem">{template.createdAt
                              .toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
                            }</p>
                          {/if}
                          <ImageLoader
                            src={`${$bundleServerURL}/app/${template.id}/screenshot.png`}
                            alt="Screenshot"
                            fadeIn
                            style="width: 100%; height: auto"
                            >
                            <svelte:fragment slot="error">
                              <!--
                              (This template does not provide a <code>screenshot.png</code>
                              in its <code>/public</code> directory.)
                              -->
                            </svelte:fragment>
                          </ImageLoader>
                          <div style="text-align: right; margin-top: 1em;">
                            <ButtonSet style="justify-content: end">
                              <Button
                                kind="tertiary"
                                icon={Help}
                                on:click={() => infoProject(template)}
                                disabled={!template.uiState?.metafile?.readme?.html}
                                >Info</Button>
                              <Button
                                kind="tertiary"
                                icon={WatsonHealthThumbnailPreview}
                                on:click={() => previewProject(template.id)}
                                >Preview</Button>
                              <Button
                                kind="secondary"
                                on:click={() => { createProjectTemplate = template }}
                                >Select</Button>
                            </ButtonSet>
                          </div>
                        </RadioTile>
                      {/each}
                    </TileGroup>
                  {:else if createProjectStep === 1 && createProjectVariant === 'Empty'}
                    <!-- we need this weird empty step because otherwise the ProgressIndicator
                      got irrationally confused, also skipping the step -->
                    <p style="font-weight: bold; margin-bottom: 1em">
                      We don't need a template for an empty project.<br/>
                      You can skip this step.
                    </p>
                    <p>
                      Technical note for advanced users:<br />
                      {#if createProjectEmptyTemplate}
                        The new project will be a clone of the empty template with
                        id={createProjectEmptyTemplate.id}
                      {:else}
                        The new project will be based on a starter template.
                      {/if}
                    </p>
                  {:else if createProjectStep === 1 && createProjectVariant === 'Import'}
                    <Form>
                      <FormGroup>
                        <TextInput 
                          bind:value={createProjectGitRepo} 
                          label="Public Git Repository"
                          placeholder="https://github.com/..."
                        />
                      </FormGroup>
                    </Form>
                  {:else if createProjectStep === 2}
                    <p>Pick a name for the new project</p>
                    <TextInput
                      labelText="Project name"
                      placeholder="Enter text"
                      bind:value={createProjectName}
                      />
                  {/if}
                </Column>
                <Column sm={1} md={3}>
                  <ProgressIndicator
                    style="margin-bottom: auto"
                    bind:currentIndex={createProjectStep}
                    vertical
                    preventChangeOnClick
                    >
                    {#each ['Variant', 'Template', 'Name'] as stepLabel, stepIndex}
                      <ProgressStep
                        complete={createProjectStep > stepIndex}
                        current={createProjectStep === stepIndex}
                        label={stepLabel}
                        />
                    {/each}
                  </ProgressIndicator>
                  <ButtonSet style="margin-top: 6em">
                  {#if createProjectStep === 0}
                    <Button
                      kind="secondary"
                      on:click={() => { createProjectStep = false}}
                      >Cancel</Button>
                    <Button
                      disabled={!createProjectVariant}
                      on:click={() => {
                        createProjectStep = 1
                        // this messes up the indicator, unfortunately
                        // if (createProjectVariant === 'Empty') createProjectStep++
                      }}
                      >Continue</Button>
                  {:else if createProjectStep === 1}
                    <Button
                      kind="secondary"
                      on:click={() => { createProjectStep = 0}}
                      >Back</Button>
                    <Button
                      disabled={
                        (createProjectVariant === 'Template' && !createProjectTemplate) ||
                        (createProjectVariant === 'Import' && !createProjectGitRepo)
                      }
                      on:click={() => { createProjectStep = 2 }}
                      >Continue</Button>
                  {:else if createProjectStep === 2}
                    <Button
                      kind="secondary"
                      on:click={() => { createProjectStep = 1}}
                      >Back</Button>
                    <Button
                      disabled={!createProjectName}
                      on:click={() => createProject() }
                      >Finish</Button>
                  {/if}
                  </ButtonSet>
                </Column>
              </Row>
            </Grid>
          {/if}
        </div>
        <SecondaryTabsContent
          projectId={currentProjectId}
          {currentProject}
          {previewUserAuth}
          {specialDoc}
          />
      </div>
    </Column>
  </Row>
</Grid>

<style>

  .__ProjectWorkspace {
    --createwizard-header-height: 72px;
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

  :global(.__ProjectWorkspace .bx--tile) {
    margin-bottom: 1em;
  }

  :global(.__ProjectWorkspace .bx--tile-input) {
    /* This is a weird hack upon hacks upon hacks!
     * Carbon uses invisible-ish <input type=radio>s for state management,
     * themselves using :active~selector hacks.
     * The invisibility is achieved by old-school clip-rect/negative margin/etc.
     * This invisibility breaks height calculation in Chrome, and in term
     * totally f's up the container's inner height, beyond repair by
     * max-height+overflow:hidden and other measures.
     * (There is a very stubborn margin at the bottom that forces the outermost
     * container to scroll.)
     * Here we just properly hide the element.
     * Unfortunately, this breaks keyboard navigation; you can't highlight the input!
     * So, a long-term TODO..., or a carbon bug, resp.
     */
    display: none;
  }

</style>
