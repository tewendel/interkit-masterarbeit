<script>

  import {
    Checkbox,
    Button,
    ButtonSet,
    Accordion,
    AccordionItem,
    Toolbar,
    ToolbarBatchActions,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    DataTable,
    Modal
  } from 'carbon-components-svelte'

  import DataTablePaginationAutofit from '../Data/DataTablePaginationAutofit.svelte'

  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import ErrorFilled from 'carbon-icons-svelte/lib/ErrorFilled.svelte'
  import ErrorOutline from 'carbon-icons-svelte/lib/ErrorOutline.svelte'
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte'
  import MisuseOutline from 'carbon-icons-svelte/lib/MisuseOutline.svelte'
  import EventSchedule from 'carbon-icons-svelte/lib/EventSchedule.svelte'

  import { InterkitClient } from 'interkit'

  let userId = InterkitClient.userId

  export let scheduledevents
  export let projectId

  const verbose = true

  let filters = {
    statusScheduled: true
  }

  const trivialSort = (a, b) => a < b ? -1 : 1
  const dateSort = (a, b) => a - b
  // FIXME this works only one way
  const boolSort = (a, b) => (a === b) ? 0 : a ? -1 : 1

  let selection = []
  let pageSize = 30
  let page = 1

  const headers = [
    {
      key: 'id',
      show: true,
      value: 'ID',
      sort: trivialSort
    },
    {
      key: 'method',
      show: true,
      value: 'Method',
      sort: trivialSort
    },
    {
      key: 'execTime',
      show: true,
      value: 'Date',
      sort: trivialSort
    },
    {
      key: 'status',
      show: true,
      value: 'Status',
      sort: trivialSort
    },
    {
      key: 'usersSummary',
      show: true,
      value: 'Users',
      sort: false
    },
    {
      key: 'payloadSummary',
      show: true,
      value: 'Payload',
      sort: trivialSort
    }
  ]

  const execTimeFormatLocaleOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: undefined,
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit'
  }
  const execTimeFormat = new Intl.DateTimeFormat('de-DE', execTimeFormatLocaleOptions)

  const summarizePayloadContent = scheduledevent => {
    const p = scheduledevent.payload
    switch (scheduledevent.method) {
      case 'user.moveTo':
        /* example payload
          {
            "projectId" : "pR0j3CtIdFooo",
            "userId" : "uS3rIdFoooo",
            "boardId" : "board1",
            "nodeId" : "node1"
          }
        */
        return `${p.userId}→${p.nodeId}_${p.boardId}`
      case 'users.moveTo':
        /* example payload
          {
            "projectId" : "pR0j3CtIdFooo",
            "userIds" : [ "uS3rIdFoooo", ... ],
            "boardId" : "board1",
            "nodeId" : "node1"
          }
        */
        return `${p.userIds.length}users`
          + `→${p.boardId}_${p.nodeId}`
          + ` ${p.userIds.join(',')}`
      case 'message.send':
        /* example payload (yes, contains another nested payload)
          {
            "projectId" : "pR0j3CtIdFooo",
            "channel_key" : "board1",
            "recipients" : [ "uS3rIdFoooo" ],
            "origin" : "handler",
            "payload" : {
              "type" : "text",
              "text" : "How are you?",
              "options" : { "delay" : 1 }
            }
          }
        */
        const info = p.payload.type === 'text' ? ` »${p.payload.text}«` : ''
        return `${p.payload.type}${info}→${p.channel_key}→${p.recipients.join(',')}`
      default:
        return JSON.stringify(p)
    }
  }

  const summarizePayloadUserIds = scheduledevent => {
    const p = scheduledevent.payload
    switch (scheduledevent.method) {
      case 'user.moveTo':
        return p.userId
      case 'users.moveTo':
        return p.userIds.join(' ')
      case 'message.send':
        return p.recipients.join(' ')
    }
    return 'n/a'
  }

  const STATUS_SCHEDULED = 'scheduled'

  let rows
  $: rows = scheduledevents ? scheduledevents
    .map(scheduledevent => ({
      ...scheduledevent,
      payloadSummary: summarizePayloadContent(scheduledevent),
      usersSummary: summarizePayloadUserIds(scheduledevent)
      // createdAt: new Date(message.createdAt),
    }))
    .filter(scheduledevent => (!filters.statusScheduled || (filters.statusScheduled && scheduledevent.status === STATUS_SCHEDULED)))
    : []

  const batchDelete = async () => {
    const expect = selection.length
    const result = await InterkitClient.call('events.delete', selection)
    console.log('deleted', { expect, result })
    if (expect === result) {
      selection = []
    } else {
      window.alert(`expected to delete ${expect} messages, but only ${result} got deleted`)
    }
  }

  const batchSetStatus = async (status) => {
    const expect = selection.length
    const result = await InterkitClient.call('events.setStatus', { ids: selection, status })
    console.log('setStatus', { expect, result })
    if (expect === result) {
      if (status !== 'scheduled' && filters.statusScheduled) {
        selection = []
      }
    } else {
      window.alert(`expected to set status ${status} for ${expect} events, but only ${result} got set`)
    }
  }

  let openShowHideColumns = false
  let dataTableToolbarBatchActionsActive = false

</script>

{#if rows}
  <div class="ScheduledeventsListTableContainer">
    <DataTable
      style={`
        background: #f4f4f4;
        /* = pageSize * dense row + search/actions + thead + data table padding-top */
        min-height: ${(pageSize || 0) * 24 + 32 + 24 + 2}px;
      `}
      size="compact"
      expandable
      sortable
      selectable
      batchSelection
      bind:selectedRowIds={selection}
      {pageSize}
      {page}
      headers={headers.filter(_ => _.show)}
      {rows}
      >

      <Toolbar size="sm">
        <ToolbarBatchActions
          bind:active={dataTableToolbarBatchActionsActive}
          on:cancel={(evt) => {
            // do not clear selection after cancel
            evt.preventDefault()
            dataTableToolbarBatchActionsActive = false
          }}
          formatTotalSelected={num => `${num}\u00a0event${num > 1 ? 's' : ''}`}
          >
          <Button size="small" icon={TrashCan} on:click={batchDelete}>Delete</Button>
          <Button size="small" icon={Checkmark} on:click={() => { batchSetStatus('done') }}>Set done</Button>
          <Button size="small" icon={EventSchedule} on:click={() => { batchSetStatus('scheduled') }}>Set scheduled</Button>
          <Button size="small" icon={MisuseOutline} on:click={() => { batchSetStatus('cancelled') }}>Set cancelled</Button>
        </ToolbarBatchActions>

        <ToolbarContent>
          <ToolbarSearch
            persistent
            value=""
            shouldFilterRows
            on:input={ evt => { console.log('ToolbarSearch input', evt) }}
            />
          <ToolbarMenu>
            <ToolbarMenuItem on:click={() => { openShowHideColumns = true }}>
              toggle columns…
            </ToolbarMenuItem>
            <ToolbarMenuItem
              on:click={() => { filters.statusScheduled = !filters.statusScheduled }}
              >
              <Checkbox checked={filters.statusScheduled} labelText="hide done" />
            </ToolbarMenuItem>
          </ToolbarMenu>
        </ToolbarContent>
      </Toolbar>

      <div slot="expanded-row" let:row>
        {#if verbose}
          <pre>
            {JSON.stringify(row, null, 2)}
          </pre>
        {/if}
      </div>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'execTime'}
          <span title={cell.value} class="cell__1line">{ execTimeFormat.format(cell.value) }</span>
        {:else}
          <span title={cell.value} class="cell__1line">{cell.value || ""}</span>
        {/if}
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

    <DataTablePaginationAutofit
      bind:page
      bind:pageSize
      totalItems={rows.length}
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

  .ScheduledeventsListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }

  .ScheduledeventsListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .ScheduledeventsListTableContainer :global(.bx--table-header-label) {
    max-width: 100%;
  }

</style>
