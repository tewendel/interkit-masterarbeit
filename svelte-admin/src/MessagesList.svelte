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

  import { InterkitClient } from 'interkit'

  export let messages
  export let projectId

  let showCol = {
    id: true,
    channel_key: true,
    payloadType: true,
    payloadContent: true,
    payloadLabel: true,
    createdAt: true,
    recipients: false,
    recipientsCount: true,
    seen: false,
    seenCount: true
  }

  const trivialSort = (a, b) => a < b ? -1 : 1

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

</script>

{#if rows}
  <div class="MessagesListTableContainer">
    <Accordion>
      <AccordionItem title="show/hide columns">
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
        <pre>
          {JSON.stringify(row, null, 2)}
        </pre>
      </div>
      <span slot="cell" let:row let:cell>
        {#if cell.key === 'payload'}
          <span>{ JSON.stringify(cell.value) }</span>
        {:else if cell.key === 'createdAt'}
          <span title={cell.value} class="cell__1line">{ createdAtdateTimeFormat.format(cell.value) }</span>
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
        <Button kind="ghost" on:click={() => { window.alert(selection.join(' ')) }}>{selection.length} selected</Button>
        <Button icon={TrashCan} on:click={batchDelete}>Delete</Button>
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
    table-layout: fixed; /* make text-overflow work */
  }

  .MessagesListTableContainer :global(td > span) {
    max-width: 100%;
  }

</style>
