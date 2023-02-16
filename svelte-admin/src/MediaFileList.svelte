<script>

  import { onDestroy, createEventDispatcher } from 'svelte'
  import {
    DataTable,
    Pagination,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarContent,
    ToolbarSearch
  } from "carbon-components-svelte"

  const dispatch = createEventDispatcher()

  import MediaFilePreview from './MediaFilePreview.svelte'
  import { InterkitClient, util } from 'interkit'

  export let mediafiles // this should be an array, not a store
  export let radio = false
  export let value
  export let projectId
  export let showChatCols = false
  export let sortKey = 'name'
  export let sortDirection = 'ascending'

  let headers

  $: headers = [
    { key: "name", value: "name" },
    { key: "type", value: "type" },
    { key: "duration", value: "duration" },
    { key: "preview", value: "preview", sort: false },
    { key: "link", value: "link", sort: false },
    ...(showChatCols ? [
      { key: "userId", value: "userId" },
      { key: "boardId", value: "boardId" },
      { key: "nodeId", value: "nodeId" },
    ] : []),
    { key: "createdAt", value: "createdAt" },
    { key: "overflow", sort: false, empty: true },
  ];

  let rows = [];
  // add links to list of mediafiles
  $: {
    rows = mediafiles ? mediafiles.map(mediafile => {
        return {
          ...mediafile,
          id: mediafile.meta.key,
          createdAt: mediafile.meta.createdAt,
          duration: util.formatDuration(mediafile.meta.duration),          
          link: INTERKIT_SERVER_URL + mediafile._downloadRoute + "/mediafiles/" + mediafile._id + "/original/" + mediafile._id + mediafile.extensionWithDot,
          userId: mediafile.meta.userId,
          boardId: mediafile.meta.boardId,
          nodeId: mediafile.meta.nodeId
        }
    })
    : []
    if (radio && mediafiles) {
      rows = rows.concat({ name: "empty", value: null })
    }
  }

  let searchQuery

  const searchFunction = (m, query) => {
    // console.log(m)
    if (!query || query == "") return true
    return m?.name.toLowerCase().includes(query.toLowerCase()) ||
      m?.type?.toLowerCase()?.includes(query.toLowerCase()) ||
      m?.userId?.includes(query) ||
      m?.boardId?.includes(query) ||
      m?.nodeId?.includes(query)
  }

  let rowsFiltered = [];
  $: {
    rowsFiltered = rows
      .filter(m => searchFunction(m, searchQuery))
  }

  let selectedRowIds = [value?.value]

  /* have to use this clunky, explicit two-way data-flow,
   * construct of update/selected to get around weird issues
   * of either missed updates or infinited update loops
   * (which happen with $ reactivity and regular bind)
   * root cause: we can't normally two-bind the value 
   * because it has to be wrapped into an array-of-ids for the DataTable,
   * and { value: …, type: … } for the dispatch.
   * i'm sure better solutions exist.
   * see https://stackoverflow.com/q/72407572/629238
   */

  export let update = newValue => {
    selectedRowIds = [newValue?.value]
  }

  $: dispatch('selected', {
    value: selectedRowIds[0],
    type: 'mediaFile'
  })

  const removeRow = (row)=> {
    if(confirm("permanently delete mediafile?")) {
      InterkitClient.call('mediafile.delete', {key: row.meta.key, projectId})   
    }
  }

  const createdAtdateTimeFormatLocaleOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: undefined,
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit'
  }
  const createdAtdateTimeFormat = new Intl.DateTimeFormat('de-DE', createdAtdateTimeFormatLocaleOptions)

  let pagination = {
    pageSize: 10,
    page: 1
  }
  
</script>

{#if rows}

  <div class="MediaFileListTableContainer">
    <DataTable
      sortable
      {sortKey}
      {sortDirection}
      {radio}
      bind:selectedRowIds
      pageSize={pagination.pageSize}
      page={pagination.page}
      {headers}
      rows={rowsFiltered}
      >

      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch bind:value={searchQuery}/>
        </ToolbarContent>
      </Toolbar>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'overflow'}
            {#if row.name != "empty"}
              <OverflowMenu style="float: right" flipped>
                <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
                <OverflowMenuItem on:click={()=>{alert(row.meta?.key)}} text="show key" />
              </OverflowMenu>
            {/if}
        {:else if cell.key === 'name'}
          <span title={cell.value} class="cell__1line">{cell.value}</span>
        {:else if cell.key === 'type' && cell.value}
          {row.type}
        {:else if cell.key === 'preview'}
          <MediaFilePreview key={row.meta?.key} {projectId} mediaManager/>
        {:else if cell.key === 'link' && cell.value}
          <a href={row.link} title={row.link} target="_blank">url</a>
        {:else if cell.key === 'userId' || cell.key === 'boardId' || cell.key === 'nodeId'}
          <span title={cell.value} class="cell__1line">{cell.value}</span>
        {:else if cell.key === 'createdAt'}
          {#if cell.value}
            <span title={cell.value} class="cell__1line">{ createdAtdateTimeFormat.format(cell.value) }</span>
          {:else}
            <i>undefined</i>
          {/if}
        {:else}{cell.value || ""}{/if}
      </span>

    </DataTable>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={rows.length}
      pageSizes={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      />
  </div>

{:else}
  loading...
{/if}

<style>

  .cell__1line {
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .MediaFileListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }

  .MediaFileListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .MediaFileListTableContainer :global(td > span) {
    max-width: 100%;
  }
</style>
