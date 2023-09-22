<script>
  import { push } from 'svelte-spa-router';
  
  import { InterkitClient } from 'interkit'
  import { bundleServerURL$ } from '../BundleServer.js'
  import { projectManagerSortKey, projectManagerSortDirection, projectManagerPage } from '../admin.js'
  import DataTablePaginationAutofit from '../Data/DataTablePaginationAutofit.svelte'
  
  import { 
    DataTable,
    Toolbar,
    ToolbarContent,
    Button,
    ButtonSet,
    Tag,
    OverflowMenu,
    OverflowMenuItem,
    ImageLoader,
  } from "carbon-components-svelte";
  import Information from 'carbon-icons-svelte/lib/Information.svelte'
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import QID from 'carbon-icons-svelte/lib/QID.svelte'
  import Template from 'carbon-icons-svelte/lib/Template.svelte'
  import WatsonHealthThumbnailPreview from 'carbon-icons-svelte/lib/WatsonHealthThumbnailPreview.svelte'
  
  export let projectRows
  export let previewProject
  export let description

  const bundleServerURL = bundleServerURL$
  const userIsRole = InterkitClient.userIsRole
    
  let sortKey = $projectManagerSortKey
  $: projectManagerSortKey.set(sortKey)

  let sortDirection = $projectManagerSortDirection
  $: projectManagerSortDirection.set(sortDirection)

  let page = 1
  $: projectManagerPage.set(page)

  let pageSize = 10

  const headers = [
    { key: 'favicon', empty: true },
    { key: 'name', value: 'Project name' },
    { key: 'createdAt', value: 'Created At', sort: (a, b) => new Date(a||0) - new Date(b||0), },
    { key: 'cpu', value: 'CPU usage' },
    { key: 'overflow', empty: true }
  ]

  let expandedRowIds = []
  $: expandedRowIds = projectRows
    .filter(row => row.uiState?.metafile?.description?.html)
    .map(row => row.id)

  let nonExpandableRowIds = []
  $: nonExpandableRowIds = projectRows
    .filter(row => !row.uiState?.metafile?.description?.html)
    .map(row => row.id)

  const dataTableOverheadHeight = 0 +
  48 + // header of outer UI
  68 + // DataTable title
  2 + // DataTable container padding top
  48 + // DataTable toolbar
  48 + // DataTable thead = 1 row height
  40 + // DataTable tfoot
  24   // potential horizontal scrollbar + buffer

  const openProject = id => push('/' + id)

  const infoProject = (row, file) => {
    secondaryTabIndex.set(1)
    secondaryTabSpecialDoc.set(row.uiState.metafile[file].html)
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

  const duplicateProject = async (row) => {
    console.log("duplicating project", row.id)
    await InterkitClient.call("project.duplicate", {projectId: row.id})
  }

  const updateProjectSetIsTemplate = async (row, isTemplate) => {
    await InterkitClient.call('project.setIsTemplate', { projectId: row._id, isTemplate })
  }
  
</script>  

<DataTable
  style={`
    background: #f4f4f4;
    /* = pageSize * row + search/actions + thead + data table padding-top */
    min-height: ${(pageSize || 0) * 48 + 32 + 48 + 2 + 68}px;
  `}
  
  sortable
  bind:sortKey
  bind:sortDirection
  {pageSize}
  bind:page
  {headers}
  rows={projectRows}
  batchExpansion
  {description}
  
  {nonExpandableRowIds}
  >
  <Toolbar>
    <ToolbarContent>
      <slot/>
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:row let:cell>
    {#if cell.key === 'favicon'}
      {#if $bundleServerURL}
        <ImageLoader
          src={`${$bundleServerURL}/app/${row.id}/favicon.png`}
          alt="Favicon"
          fadeIn
          style="max-width: 2em"
          >
          <svelte:fragment slot="error">
          </svelte:fragment>
        </ImageLoader>
      {/if}
    {/if}
    {#if cell.key === 'name'}
      <!--<span on:click={() => previewProject(row.id)} class="clickable">-->
      <span class="name-field">
        {#if row.isTemplate}
          <Tag>Template</Tag>
        {/if}
        {row.name}
        {#if row.uiState?.metafile?.description?.html}
          <br>
          <span class="project-description">
            {@html row.uiState?.metafile?.description?.html}
          </span>
        {/if}
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
      <ButtonSet style="justify-content: end">
        <Button
          kind="ghost"
          size="small"
          icon={Edit}
          on:click={() => openProject(row.id)}
          >Edit</Button>
        <!--
        <Button
          kind="ghost"
          size="small"
          icon={Information}
          disabled={!row.uiState?.metafile?.readme?.html}
          on:click={() => infoProject(row)}
          >Readme</Button>
        -->
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
          <OverflowMenuItem
            hasDivider
            on:click={() => infoProject(row, 'readme')}
            disabled={!row.uiState?.metafile?.readme?.html}
            ><Information />&ensp;Readme.md</OverflowMenuItem>
          <OverflowMenuItem
            on:click={() => infoProject(row, 'project')}
            disabled={!row.uiState?.metafile?.project?.html}
            ><Information />&ensp;Project.md</OverflowMenuItem>
          {#if $userIsRole?.admin}
            {#if row.isTemplate}
              <OverflowMenuItem
                hasDivider
                danger
                on:click={() => updateProjectSetIsTemplate(row, false)}
                ><Template />&ensp;Unset&nbsp;template</OverflowMenuItem>
            {:else}
              <OverflowMenuItem
                hasDivider
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
  rowHeight={72}
  pageSizeAuto={true}
  />


<style>
  .project-description {
    display: inline-block;
  }

  :global(.project-description p) {
    font-size: 0.75rem;
    line-height: 1rem;
    margin-bottom: 0.25rem;
  }

</style>