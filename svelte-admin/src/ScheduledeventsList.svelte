<script>

  import {
    Checkbox,
    Button,
    ButtonSet,
    Accordion,
    AccordionItem,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    DataTable
  } from 'carbon-components-svelte'

  import DataTablePaginationAutofit from './DataTablePaginationAutofit.svelte'

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

  let verbose = false

  let filters = {
    statusScheduled: true
  }

  let showCol = {
    id: true,
    method: true,
    execTime: true,
    status: true,
    usersSummary: true,
    payloadSummary: true
  }

  const trivialSort = (a, b) => a < b ? -1 : 1
  const dateSort = (a, b) => a - b
  // FIXME this works only one way
  const boolSort = (a, b) => (a === b) ? 0 : a ? -1 : 1

  let selection = []
  let pageSize = 30
  let page = 1

  let headers

  $: headers = [
    ...(showCol.id ? [{
      key: 'id',
      value: 'id',
      sort: trivialSort
    }] : []),
    ...(showCol.method ? [{
      key: 'method',
      value: 'method',
      sort: trivialSort
    }] : []),
    ...(showCol.execTime ? [{
      key: 'execTime',
      value: 'execTime',
      sort: trivialSort
    }] : []),
    ...(showCol.status ? [{
      key: 'status',
      value: 'status',
      sort: trivialSort
    }] : []),
    ...(showCol.usersSummary ? [{
      key: 'usersSummary',
      value: 'users',
      sort: false
    }] : []),
    ...(showCol.payloadSummary ? [{
      key: 'payloadSummary',
      value: 'payload',
      sort: trivialSort
    }] : []),
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

</script>

{#if rows}
  <div class="ScheduledeventsListTableContainer">
    <Accordion>
      <AccordionItem title="options: verbose, filters, show/hide columns">
        <div>Options:</div>
        <Checkbox bind:checked={verbose} labelText="verbose (full message objects)" />
        <div>Filters:</div>
        <Checkbox bind:checked={filters.statusScheduled} labelText="only scheduled (not done) events (status=scheduled)" />
        <div>Columns:</div>
        {#each Object.keys(showCol) as colKey}
          <Checkbox bind:checked={showCol[colKey]} labelText={colKey} />
        {/each}
      </AccordionItem>
    </Accordion>
    <DataTable
      size="compact"
      expandable
      sortable
      selectable
      batchSelection
      bind:selectedRowIds={selection}
      {pageSize}
      {page}
      {headers}
      {rows}
      >
      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch
            persistent
            value=""
            shouldFilterRows
            on:input={ evt => { console.log('ToolbarSearch input', evt) }}
            />
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
    </DataTable>
    <DataTablePaginationAutofit
      bind:page
      bind:pageSize
      totalItems={rows.length}
      />
    {#if selection && selection.length}
      <ButtonSet style="margin-bottom: 2px">
        <Button size="small" kind="ghost" on:click={() => { window.alert(selection.join(' ')) }}>{selection.length} selected</Button>
        <Button size="small" icon={TrashCan} on:click={batchDelete}>Delete</Button>
      </ButtonSet>
      <ButtonSet>
        <Button size="small" icon={Checkmark} on:click={() => { batchSetStatus('done') }}>Set done</Button>
        <Button size="small" icon={EventSchedule} on:click={() => { batchSetStatus('scheduled') }}>Set scheduled</Button>
        <Button size="small" icon={MisuseOutline} on:click={() => { batchSetStatus('cancelled') }}>Set cancelled</Button>
      </ButtonSet>
    {/if}
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
    word-break: break-word;
  }

  .ScheduledeventsListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }
  .ScheduledeventsListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .ScheduledeventsListTableContainer :global(td > span) {
    max-width: 100%;
  }

</style>
