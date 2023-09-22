<script>
  import { onDestroy } from 'svelte'  
  
  import { InterkitClient } from 'interkit'
  import {
    currentProject,
    projectId,
    secondaryTabIndex,
    secondaryTabPreviewProjectId,
    secondaryTabsSizes,
    secondaryTabsSize,
    projectManagerTab,
    projectManagerSortKey, 
    projectManagerSortDirection, 
    projectManagerPage,
    projectManagerSortKeyTemplate, 
    projectManagerSortDirectionTemplate, 
    projectManagerPageTemplate
  } from '../admin.js'
  import { docsGo } from '../docs.js'

  import ProjectWorkspace from './ProjectWorkspace.svelte'
  import ProjectList from './ProjectList.svelte'
  import ProjectCreationWizard from './ProjectCreationWizard.svelte'
  import SecondaryTabsContent from "./SecondaryTabsContent.svelte"
  
  import {
    Button, 
    Grid,
    Row,
    Column,
    Loading,
    Tabs,
    Tab,
    TabContent
  } from "carbon-components-svelte";
  import Help from 'carbon-icons-svelte/lib/Help.svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  
  export let params = {} // these come from the route

  let projectsListSub;
  let projects;
  let previewUserAuth;
  let createProjectStep = false

  const manageProjectsSub = async (_projectId)=>{
    console.log("project subscription " + _projectId)
    if (_projectId) {
      // if there is a project loaded, we don't need the list of projects
      if (projectsListSub) { projectsListSub.stop() }
    } else {
      // if there is no project, we neeed all the projects
      projectsListSub = await InterkitClient.getSub('projects', 'projects.list') 
      projects = projectsListSub.data;
    }
  }

  onDestroy(() => {
    projectsListSub?.stop()
  })

  $: manageProjectsSub($projectId)

  $: tab = params.tab // comes from the route

  // get the created date from the history
  const getCreatedDate = project => {
    return (project?.history || []).find(h => h.event == "create_project")?.date
  }

  // just the projects, no templates, add "id" for carbon table
  $: projectRows = projects
    ? $projects
      .filter(p => !p.isTemplate)  
      .map(p => ({ ...p, id: p.id, createdAt: getCreatedDate(p) }))
      .sort((p1, p2) => p1 - p2)
    : []
  
  // just the templates, add "id" for carbon table
  let templates
  $: templates = projects
    ? $projects
        .filter(_ => _.isTemplate)
        .map(p => ({ ...p, id: p.id, createdAt: getCreatedDate(p) }))
        .sort((a, b) => a.name < b.name ? -1 : 1)
    : []

  // find the starter template  
  let createProjectEmptyTemplate
  $: createProjectEmptyTemplate = projectRows
    .filter(_ => _.isTemplate && (_.slug === 'empty' || _.name === 'empty'))?.[0]
  
  // show a project in the preview pane
  const previewProject = id => {
    secondaryTabIndex.set(0)
    secondaryTabPreviewProjectId.set(id)
  }
    
</script>

<Grid style="padding:0; height:100%; overflow-x: hidden; overflow-y: auto; max-width: none;">
  <Row>
    <Column lg="{16}">
      <div
        class="__ProjectWorkspace panes"
        style={
          `--left-pane-size: ${(1 - secondaryTabsSizes[$secondaryTabsSize]) * 100}%;` +
          `--right-pane-size: ${secondaryTabsSizes[$secondaryTabsSize] * 100}%;`
        }
        data-foo={JSON.stringify(secondaryTabsSizes)}
        >
        <div class={`left-pane`} class:left-pane--has-current-project={!!$projectId}>
          {#if $projectId}
            {#if $currentProject}
              <ProjectWorkspace 
                {tab} 
                projectId={$projectId} 
                {currentProject}
                updatePreviewUserAuth={data => { previewUserAuth = data; }}
                />
            {:else}
              <Loading style="background-color:white"/>
            {/if}
          {:else if createProjectStep === false}
            <Tabs 
              selected={$projectManagerTab}
              on:change={(event)=>{projectManagerTab.set(event.detail)}}
            >
              <Tab label="Your Projects" />
              <Tab label="Templates" />
              <svelte:fragment slot="content">
                <div class="__ProjectList">
                  <TabContent>
                    <ProjectList 
                      {projectRows}
                      {previewProject}
                      sortKeyStore={projectManagerSortKey} 
                      sortDirectionStore={projectManagerSortDirection} 
                      pageStore={projectManagerPage}
                      description="These are the projects created by your team on this server."
                    >
                      <Button
                        size="small"
                        kind="ghost"
                        icon={Help}
                        on:click={() => docsGo('/basics/build_app#creating-a-project')}
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
                    </ProjectList>
                  </TabContent>
                  <TabContent>
                    <ProjectList 
                      projectRows={templates}
                      description="These are the templates available on this server as starting points."
                      {previewProject}
                      sortKeyStore={projectManagerSortKeyTemplate} 
                      sortDirectionStore={projectManagerSortDirectionTemplate} 
                      pageStore={projectManagerPageTemplate}
                    >
                      <Button
                          size="small"
                          kind="ghost"
                          icon={Help}
                          on:click={() => docsGo('/basics/build_app#creating-a-project')}
                          >
                          Help
                        </Button>
                    </ProjectList>
                  </TabContent>   
                </div> 
              </svelte:fragment>
            </Tabs>
          {:else if createProjectStep !== false}
            <ProjectCreationWizard 
              bind:createProjectStep 
              {templates} 
              {createProjectEmptyTemplate}
              {previewProject}
            />
          {/if}
        </div>
        <SecondaryTabsContent
          projectId={$projectId}
          {currentProject}
          {previewUserAuth}
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

  .name-field {
    display: inline-block;
    padding: 5px 0px 5px 0px;
    max-height: 72px;
  }

  .panes {
    display: flex;
    height: 100%;
    height: var(--content-height);
  }

  .left-pane {
    flex-grow: 1;
    flex-shrink: 0;
    width: var(--left-pane-size);
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

  :global(.__ProjectList .bx--tab-content) {
    padding: 0;
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

  :global(.__ProjectWorkspace .bx--table-expand) {
    display: none;
  }


</style>
