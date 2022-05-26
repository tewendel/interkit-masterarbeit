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
    Pagination,
    DataTable
  } from 'carbon-components-svelte'

  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import ErrorFilled from 'carbon-icons-svelte/lib/ErrorFilled.svelte'
  import ErrorOutline from 'carbon-icons-svelte/lib/ErrorOutline.svelte'

  import { InterkitClient } from 'interkit'

  let userId = InterkitClient.userId

  export let messages
  export let projectId

  let verbose = false

  let filters = {
    channelReports: false
  }

  let showCol = {
    id: true,
    blocked: true,
    channel_key: true,
    sender: true,
    payloadType: false,
    payloadContent: true,
    payloadLabel: true,
    createdAt: true,
    recipients: false,
    recipientsCount: false,
    seen: false,
    seenCount: true
  }

  const trivialSort = (a, b) => a < b ? -1 : 1
  // FIXME this works only one way
  const boolSort = (a, b) => (a === b) ? 0 : a ? -1 : 1

  let selection = []
  let pagination = {
    pageSize: 30,
    page: 1
  }

  let headers

  $: headers = [
    ...(showCol.id ? [{
      key: 'id',
      value: 'id',
      sort: trivialSort
    }] : []),
    ...(showCol.blocked ? [{
      key: 'blocked',
      value: 'blocked',
      sort: boolSort
    }] : []),
    ...(showCol.createdAt ? [{
      key: 'createdAt',
      value: 'createdAt',
      sort: trivialSort
    }] : []),
    ...(showCol.channel_key ? [{
      key: 'channel_key',
      value: 'channel',
      sort: trivialSort
    }] : []),
    ...(showCol.sender ? [{
      key: 'sender',
      value: 'sender',
      sort: trivialSort
    }] : []),
    ...(showCol.payloadType ? [{
      key: 'payloadType',
      value: 'type',
      sort: trivialSort
    }] : []),
    ...(showCol.payloadContent ? [{
      key: 'payloadContent',
      value: 'content',
      sort: trivialSort
    }] : []),
    ...(showCol.payloadLabel ? [{
      key: 'payloadLabel',
      value: 'label',
      sort: trivialSort
    }] : []),
    ...(showCol.recipientsCount ? [{
      key: 'recipientsCount',
      value: 'Σ recipients',
      sort: trivialSort
    }] : []),
    ...(showCol.recipients ? [{
      key: 'recipients',
      value: 'recipients',
      sort: false
    }] : []),
    ...(showCol.seenCount ? [{
      key: 'seenCount',
      value: 'Σ seen',
      sort: trivialSort
    }] : []),
    ...(showCol.seen ? [{
      key: 'seen',
      value: 'seen',
      sort: false
    }] : []),
  ]

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

  const summarizePayloadContent = message => {
    switch (message.payload.type) {
      case 'text':
        return message.payload.text
      case 'choice':
        return JSON.stringify(message.payload.choice)
      case 'image':
        return message.payload.mediafileKey
      default:
        return JSON.stringify(message.payload)
    }
  }

  let rows
  $: rows = messages ? messages
    .map(message => ({
      ...message,
      payloadType: message.payload?.type,
      payloadContent: summarizePayloadContent(message),
      payloadLabel: message.payload?.options?.label,
      createdAt: new Date(message.createdAt),
      recipients: message.recipients?.join(' '),
      recipientsCount: message.recipients?.length,
      seen: message.seen?.join(' '),
      seenCount: message.seen?.length
    }))
    .filter(message => (!filters.channelReports || (filters.channelReports && message.channel_key === REPORTS_CHANNEL_KEY)))
    : []

  const batchDelete = async () => {
    const expect = selection.length
    const result = await InterkitClient.call('messages.delete', selection)
    console.log('deleted', { expect, result })
    if (expect === result) {
      selection = []
    } else {
      window.alert(`expected to delete ${expect} messages, but only ${result} got deleted`)
    }
  }

  const batchBlock = async (setBlocked) => {
    const result = await InterkitClient.call('messages.block', { projectId, messageIds: selection, setBlocked })
    console.log('batchBlock result', { setBlocked, result })
  }

  const REPORTS_CHANNEL_KEY = 'REPORTS'

  const parseReport = reportMessage => {
    let reportedMessage
    try {
      reportedMessage = JSON.parse(reportMessage?.payload?.text?.replace(/^user reported message:\s*/, ''))
      return reportedMessage
    } catch (err) {
      console.error('reportMessage parse error', err)
      return false
    }
  }

  const getReportId = reportMessage => parseReport(reportMessage)?.id

  const reportedDeleteMessage = reportMessage => {
    const id = getReportId(reportMessage)
    if (!id) {
      window.alert('error, no id')
      return
    }
    InterkitClient.call('messages.delete', [ id ])
  }

  const reportedBlockMessage = reportMessage => {
    const id = getReportId(reportMessage)
    if (!id) {
      window.alert('error, no id')
      return
    }
    InterkitClient.call('messages.block', {
      projectId,
      messageIds: [ id ],
      setBlocked: true
    })
  }

  const reportedBlockUser = async reportMessage => {
    const userId = parseReport(reportMessage)?.sender
    if (!userId) {
      window.alert('error, no id')
      return
    }
    const resultBlockMessages = await InterkitClient.call('messages.block', {
      projectId,
      userIds: [ userId ],
      setBlocked: true
    })
    const resultBlockUser = await InterkitClient.call('users.block', {
      projectId,
      userIds: [ userId ],
      setBlocked: true
    })
    console.log('batchBlock result', { userId, resultBlockMessages, resultBlockUser })
  }

  const reportedSeen = messageId => {
    InterkitClient.call('messages.see', {
      projectId,
      messageIds: [ messageId ],
      seenByUserId: $userId || 'admin'
    })
  }

</script>

{#if rows}
  <div class="MessagesListTableContainer">
    <Accordion>
      <AccordionItem title="options: verbose, filters, show/hide columns">
        <div>Options:</div>
        <Checkbox bind:checked={verbose} labelText="verbose (full message objects)" />
        <div>Filters:</div>
        <Checkbox bind:checked={filters.channelReports} labelText="only reports (channel_key=REPORTS)" />
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
      pageSize={pagination.pageSize}
      page={pagination.page}
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
        {#if row?.channel_key === REPORTS_CHANNEL_KEY}
          <pre style="font-family: monospace; white-space: pre-wrap">
            {JSON.stringify(parseReport(row), null, 2)}
          </pre>
          <ButtonSet>
            <Button size="small" icon={TrashCan} on:click={() => { reportedDeleteMessage(row) }}>Delete Message</Button>
            <Button size="small" icon={ErrorFilled} on:click={() => { reportedBlockMessage(row) }}>Block Message</Button>
            <Button size="small" icon={ErrorFilled} on:click={() => { reportedBlockUser(row) }}>Block User</Button>
          </ButtonSet>
          <ButtonSet>
            <Button size="small" on:click={() => { reportedSeen(row.id) }}>Set Seen</Button>
          </ButtonSet>
        {/if}
        {#if verbose}
          <pre>
            {JSON.stringify(row, null, 2)}
          </pre>
        {/if}
      </div>
      <span slot="cell" let:row let:cell>
        {#if cell.key === 'payload'}
          <span>{ JSON.stringify(cell.value) }</span>
        {:else if cell.key === 'createdAt'}
          <span title={cell.value} class="cell__1line">{ createdAtdateTimeFormat.format(cell.value) }</span>
        {:else if cell.key === 'blocked'}
          <span title="cell.value">{cell.value ? '🚫' : (cell.value === false ? '🟢' : '')}</span>
        {:else}
          <span title={cell.value} class="cell__1line">{cell.value || ""}</span>
        {/if}
      </span>
    </DataTable>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={rows.length}
      pageSizes={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      />
    {#if selection && selection.length}
      <ButtonSet>
        <Button size="small" kind="ghost" on:click={() => { window.alert(selection.join(' ')) }}>{selection.length} selected</Button>
        <Button size="small" icon={TrashCan} on:click={batchDelete}>Delete</Button>
        <Button size="small" icon={ErrorFilled} on:click={() => { batchBlock(true) }}>Block</Button>
        <Button size="small" icon={ErrorOutline} on:click={() => { batchBlock(false) }}>Unblock</Button>
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
  }

  .MessagesListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }
  .MessagesListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .MessagesListTableContainer :global(td > span) {
    max-width: 100%;
  }

</style>
