<script>

  import {
    Checkbox,
    Button,
    ButtonSet,
    InlineLoading,
    Toolbar,
    ToolbarBatchActions,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    DataTable,
    Modal
  } from 'carbon-components-svelte'

  import DataTablePaginationAutofit from './DataTablePaginationAutofit.svelte'

  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import ErrorFilled from 'carbon-icons-svelte/lib/ErrorFilled.svelte'
  import ErrorOutline from 'carbon-icons-svelte/lib/ErrorOutline.svelte'
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte'
  import Filter from 'carbon-icons-svelte/lib/Filter.svelte'
  import FilterRemove from 'carbon-icons-svelte/lib/FilterRemove.svelte'

  import { InterkitClient, util } from 'interkit'

  let userId = InterkitClient.userId

  export let messages
  export let projectId

  export let total
  export let page = 1
  export let limit = 10
  export let searchQuery = ""
  export let sortKey
  export let sortDirection
  export let loading = false

  export let channelReports = false

  const sortFunction = (a,b) => util.mongoSortCompare(a, b, sortKey, sortDirection)

  const setSort = ({key, direction}) => {
    sortKey = key
    sortDirection = direction === 'ascending' ? 1 : direction === 'descending' ? -1 : 0
  }


  /* with better pagination we can be verbose always */
  const verbose = true

  let showCol = {
    id: true,
    blocked: true,
    channel_key: true,
    sender: true,
    "payload.type": false,
    payloadContent: true,
    "payload.options.label": true,
    createdAt: true,
    recipients: false,
    recipientsCount: false,
    seen: false,
    seenCount: true
  }

  const alreadySorted = (a, b) => 0

  let selection = []

  const headers = [
    {
      key: 'id',
      show: true,
      value: 'ID',
      sort: false
    },
    {
      key: 'blocked',
      show: true,
      value: 'Blocked',
      sort: alreadySorted
    },
    {
      key: 'createdAt',
      show: true,
      value: 'Created\u00a0at',
      sort: alreadySorted
    },
    {
      key: 'channel_key',
      show: true,
      value: 'Channel',
      sort: alreadySorted
    },
    {
      key: 'sender',
      show: true,
      value: 'Sender',
      sort: alreadySorted
    },
    {
      key: "payload.type",
      show: false,
      value: 'Type',
      sort: alreadySorted
    },
    {
      key: 'payloadContent',
      show: true,
      value: 'Content',
      sort: false
    },
    {
      key: "payload.options.label",
      show: true,
      value: 'Label',
      sort: alreadySorted
    },
    {
      key: 'recipientsCount',
      show: false,
      value: 'Σ\u00a0recipients',
      sort: alreadySorted
    },
    {
      key: 'recipients',
      show: false,
      value: 'Recipients',
      sort: false
    },
    {
      key: 'seenCount',
      show: true,
      value: 'Σ\u00a0seen',
      sort: alreadySorted
    },
    {
      key: 'seen',
      show: false,
      value: 'Seen',
      sort: false
    }
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
      case 'system':
        return `[system] ${message.payload.text}`
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
    .sort(sortFunction)
    .map(message => ({
      ...message,
      //"payload.type": message.payload?.type,
      payloadContent: summarizePayloadContent(message),
      //"payload.options.label": message.payload?.options?.label,
      //createdAt: new Date(message.createdAt),
      //recipients: message.recipients?.join(' '),
      //recipientsCount: message.recipientsCount,
      //seen: message.seen?.join(' '),
      //seenCount: message.seenCount
    }))
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

  let openShowHideColumns = false
  let dataTableToolbarBatchActionsActive = false

</script>

{#if rows}
  <div class="MessagesListTableContainer">
    <DataTable
      style={`
        background: #f4f4f4;
        /* = pageSize * dense row + search/actions + thead + data table padding-top */
        min-height: ${(limit || 0) * 24 + 32 + 24 + 2}px;
      `}
      size="compact"
      expandable
      sortable
      selectable
      batchSelection
      on:click:header={ event => setSort({ key: event.detail.header.key, direction: event.detail.sortDirection})}
      bind:selectedRowIds={selection}
      pageSize={limit}
      page={1}
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
          formatTotalSelected={num => `${num}\u00a0message${num > 1 ? 's' : ''}`}
          >
          <Button size="small" icon={TrashCan} on:click={batchDelete}>Delete</Button>
          <Button size="small" icon={ErrorFilled} on:click={() => { batchBlock(true) }}>Block</Button>
          <Button size="small" icon={ErrorOutline} on:click={() => { batchBlock(false) }}>Unblock</Button>
        </ToolbarBatchActions>

        <ToolbarContent>
          <ToolbarSearch
            persistent
            placeholder="Seach message text, sender, channel, ID, recipient"
            bind:value={searchQuery}
            />
          <InlineLoading style={`flex: 1; padding-left: 1em; visibility: ${loading ? "visible" : "hidden"}`}/>
          <ToolbarMenu>
            <ToolbarMenuItem on:click={() => { openShowHideColumns = true }}>
              toggle columns…
            </ToolbarMenuItem>
            <!--
            <ToolbarMenuItem on:click={() => { verbose = !verbose }}>
              {verbose ? 'show' : 'hide'}
              full message objects in expanded rows
            </ToolbarMenuItem>
            -->
            <ToolbarMenuItem
              on:click={() => { channelReports = !channelReports }}
              >
              <Checkbox checked={channelReports} labelText="only new reports" />
            </ToolbarMenuItem>
          </ToolbarMenu>
          <!--
          <Button kind="ghost" icon={Filter} size="small" />
          -->
        </ToolbarContent>
      </Toolbar>

      <div slot="expanded-row" let:row>
        {#if row?.channel_key === REPORTS_CHANNEL_KEY}
          <pre style="font-family: monospace; white-space: pre-wrap">
            {JSON.stringify(parseReport(row), null, 2)}
          </pre>
          <ButtonSet>
            <Button size="small" icon={TrashCan} on:click={() => { reportedDeleteMessage(row) }}>Delete reported message</Button>
            <Button size="small" icon={ErrorFilled} on:click={() => { reportedBlockMessage(row) }}>Block reported message</Button>
            <Button size="small" icon={ErrorFilled} on:click={() => { reportedBlockUser(row) }}>Block User</Button>
          </ButtonSet>
          <ButtonSet>
            <Button size="small" icon={Checkmark} on:click={() => { reportedSeen(row.id) }}>Set Seen</Button>
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
          <span class="cell__1line">{ JSON.stringify(cell.value) }</span>
        {:else if cell.key === 'createdAt'}
          <span title={cell.value} class="cell__1line">{ createdAtdateTimeFormat.format(cell.value) }</span>
        {:else if cell.key === 'blocked'}
          <span title={cell.value}>{cell.value ? '🚫' : (cell.value === false ? '🟢' : '')}</span>
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
      bind:pageSize={limit}
      bind:page={page}
      totalItems={total}
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

  .MessagesListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }

  .MessagesListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }

  .MessagesListTableContainer :global(.bx--table-header-label) {
    max-width: 100%;
  }

</style>
