<script>

  import { onDestroy, createEventDispatcher } from 'svelte'
  import {
    Button,
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarBatchActions,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Checkbox,
    Modal
  } from "carbon-components-svelte"

  const dispatch = createEventDispatcher()

  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";

  import DataTablePaginationAutofit from './DataTablePaginationAutofit.svelte'
  import MediaFilePreview from './MediaFilePreview.svelte'
  import { InterkitClient, util } from 'interkit'

  export let mediafiles // this should be an array, not a store
  export let radio = false
  export let value
  export let projectId
  export let showChatCols = false
  export let sortKey = 'name'
  export let sortDirection = 'ascending'

  const trivialSort = (a, b) => a < b ? -1 : 1
  const dateSort = (a, b) => a - b

  const headers = [
    {
      key: "name",
      show: true,
      value: "Name",
      sort: trivialSort
    },
    {
      key: "key",
      show: true,
      value: "Key",
      sort: trivialSort
    },
    {
      key: "type",
      show: true,
      value: "Type",
      sort: trivialSort
    },
    {
      key: "duration",
      /* we assume that we don't need all info in "radio mode" and try to save space */
      show: !radio,
      value: "Duration",
      sort: trivialSort
    },
    {
      key: "preview",
      show: true,
      value: "Preview",
      sort: false
    },
    {
      key: "link",
      show: !radio,
      value: "Link",
      sort: false
    },
    {
      key: "userId",
      show: showChatCols,
      value: "User\u00a0ID",
      sort: trivialSort
    },
    {
      key: "boardId",
      show: showChatCols,
      value: "Board\u00a0ID",
      sort: trivialSort
    },
    {
      key: "nodeId",
      show: showChatCols,
      value: "Node\u00a0ID",
      sort: trivialSort
    },
    {
      key: "createdAt",
      show: true,
      value: "Created\u00a0at",
      sort: dateSort
    }
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

  let selectedRowIds = (value && value.value) ? [value.value] : []

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

  const batchDelete = () => {
    selectedRowIds.forEach(key => {
      InterkitClient.call('mediafile.delete', { key, projectId })
    })
    selectedRowIds = []
    dataTableToolbarBatchActionsActive = false
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

  export let pageSize = 10
  let page = 1

  const dataTableOverheadHeight = 0 +
    48 + // header of outer UI
    40 + // tabs: Project | User generated
    16 + // tabpanel padding = 1rem
    100 + // upload drop zone including margins
    32 + // DataTable search
    48 + // DataTable thead = 1 row height
    40 + // DataTable tfoot
    24   // potential horizontal scrollbar + buffer

  let dataTableToolbarBatchActionsActive = false
  let openShowHideColumns = false

</script>

{#if rows}

  <div class="MediaFileListTableContainer">
    <!-- TODO get f4f4f4 from carbon -->
    <DataTable
      style={`
        background: #f4f4f4;
        /* = pageSize * row + search/actions + thead + data table padding-top */
        min-height: ${(pageSize || 0) * 48 + 32 + 48 + 2}px;
      `}
      sortable
      selectable={!radio}
      batchSelection={!radio}
      {sortKey}
      {sortDirection}
      {radio}
      bind:selectedRowIds
      {pageSize}
      {page}
      headers={headers.filter(_ => _.show)}
      rows={rowsFiltered}
      >

      <Toolbar size="sm">
        <ToolbarContent>
          <ToolbarSearch bind:value={searchQuery}/>
          <ToolbarMenu>
            <ToolbarMenuItem on:click={() => { openShowHideColumns = true }}>
              toggle columns…
            </ToolbarMenuItem>
          </ToolbarMenu>
        </ToolbarContent>
        {#if !radio}
          <ToolbarBatchActions
            bind:active={dataTableToolbarBatchActionsActive}
            on:cancel={(evt) => {
              // do not clear selection after cancel
              evt.preventDefault()
              dataTableToolbarBatchActionsActive = false
            }}
            formatTotalSelected={num => `${num}\u00a0file${num > 1 ? 's' : ''}`}
            >
            <Button
              size="small"
              icon={TrashCan}
              on:click={batchDelete}
              iconDescription="delete"
              tooltipPosition="left"
              >
              delete
            </Button>
          </ToolbarBatchActions>
        {/if}
      </Toolbar>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'key'}
          <span title={row.meta?.key} class="cell__1line">{row.meta?.key}</span>
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

      <svelte:fragment slot="cell-header" let:header>
        <div
          title={header.value}
          style="max-width: 100%; overflow: hidden; text-overflow: ellipsis"
          >
          {header.value}
        </div>
      </svelte:fragment>

    </DataTable>
    <!-- we assume that in "radio" mode we're in a container that wouldn't like auto-height (like a Modal) -->
    <DataTablePaginationAutofit
      bind:pageSize
      bind:page
      totalItems={rows.length}
      overheadHeight={dataTableOverheadHeight}
      rowHeight={48}
      pageSizeAuto={!radio}
      />
  </div>

{:else}
  loading...
{/if}

<Modal
  bind:open={openShowHideColumns}
  modalHeading="Show/hide columns"
  passiveModal
  primaryButtonText="Done"
  >
  {#each headers as h, i}
    <Checkbox bind:checked={h.show} labelText={h.value} />
  {/each}
</Modal>

<style>

  .MediaFileListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }

  .MediaFileListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .MediaFileListTableContainer :global(.bx--table-header-label) {
    max-width: 100%;
  }

</style>
