<script>

  import { onMount, onDestroy } from 'svelte'
  import {
    Checkbox,
    Accordion,
    AccordionItem,
    Pagination,
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    // ToolbarBatchActions,
    ToolbarContent,
    ToolbarSearch,
    Button,
    ButtonSet,
    Modal
  } from "carbon-components-svelte";
  import Movement from "carbon-icons-svelte/lib/Movement.svelte";
  import Send from "carbon-icons-svelte/lib/Send.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import ErrorFilled from "carbon-icons-svelte/lib/ErrorFilled.svelte";
  import ErrorOutline from "carbon-icons-svelte/lib/ErrorOutline.svelte";

  import { InterkitClient, util } from 'interkit';

  export let users; // this should be an array, not a store
  export let projectId;
  export let previewUserId

  let userId = InterkitClient.userId

  let usersSelection = []
  let pagination = {
    pageSize: 30,
    page: 1
  }

  let openQuickMessage = false
  let quickMsgText = 'hello'
  let quickMsgChannel = 'board1'
  let quickMsgResult = ''

  let openMoveTo = false
  export let moveToBoardId = ''
  export let moveToNodeId = ''
  let moveToResult = ''

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

  let roleAssignmentStore = null

  onMount(async () => {
    console.log("sub role-assignment")
    let sub = await InterkitClient.getSub("role-assignment", "roleAssignment")
    console.log(sub)
    roleAssignmentStore = sub.data
  })

  $: if (roleAssignmentStore) console.log($roleAssignmentStore)

  const trivialSort = (a, b) => a < b ? -1 : 1
  // FIXME this works only one way
  const boolSort = (a, b) => (a === b) ? 0 : a ? -1 : 1

  let showCol = {
    userIcon: true,
    blocked: true,
    username: true,
    roles: false,
    id: true,
    createdAt: true,
    online: true,
    boards: true,
    userToken: true,
    pushToken: false,
  }

  let headers

  $: headers = [
    ...(showCol.userIcon ? [{
      key: 'userIcon',
      value: 'u'
    }] : []),
    ...(showCol.username ? [{
      key: "username",
      value: "username",
      sort: trivialSort
    }] : []),
    ...(showCol.blocked ? [{
      key: "blocked",
      value: "blocked",
      sort: boolSort
    }] : []),
    ...(showCol.roles ? [{
      key: "roles",
      value: "roles",
      sort: trivialSort
    }] : []),    
    ...(showCol.id ? [{
      key: "id",
      value: "id",
      sort: false
    }] : []),
    ...(showCol.createdAt ? [{
      key: "createdAt",
      value: "createdAt",
      sort: trivialSort
    }] : []),
    ...(showCol.online ? [{
      key: "status.online",
      value: "online",
      sort: trivialSort
    }] : []),
    ...(showCol.boards ? [{
      key: "boards",
      value: "boards",
      sort: false
    }] : []),
    ...(showCol.userToken ? [{
      key: "userToken",
      value: "userToken",
      sort: false
    }] : []),
    ...(InterkitClient.userEnableHeartbeat
      ? [{ key: "lastHeartbeat", value: "lastHeartbeat" }]
      : []
    ),
    ...(showCol.pushToken ? [{
      key: "pushnotificationRegistrationToken",
      value: "push token",
      sort: false
    }] : [])
  ];

  const userIconSelf = '\u{01f464}\uFE0E'
  const userIconPreview = '\u{01f4f1}\uFE0E'

  const summarizeBoardState = boardState => Object.keys(boardState || {})
    .map(boardId => `${boardId}_${boardState[boardId]?.nodeId}`)
    .join(' ')

  let rows = [];
  // add links to list of mediafiles
  $: {
    rows = users ? users
      // .filter(user => user.id !== $userId) // hide own user
      .map(user => {
        return {
          ...user,
          userIcon: user.id === $userId ? userIconSelf : (user.id === previewUserId ? userIconPreview : ''),
          userToken: user?.projectUserData?.[projectId]?.userToken,
          lastHeartbeat: user?.projectUserData?.[projectId]?.lastHeartbeat,
          pushnotificationRegistrationToken: user?.projectUserData?.[projectId]?.pushnotificationRegistrationToken,
          boards: summarizeBoardState(user?.projectUserData?.[projectId]?.boardState),
          roles: roleAssignmentStore && $roleAssignmentStore.reduce((acc, roleAssignment) => {
            if (roleAssignment.user._id === user.id) {
              acc.push(roleAssignment.role._id)
            }
            return acc
          }, []).join(", ")
        }
    })
    : []
    console.log(rows)
    window._rows = rows
  }

  let searchQuery;
  const searchFunction = (row, query) => {
    //console.log(m)
    if(!query || query == "") return true;
    else {
      if(row?.userToken?.toLowerCase().includes(query.toLowerCase())
        || row?.username?.toLowerCase()?.includes(query.toLowerCase())) {
        return true
      } else {
        return false;
      }
    }
  }

  const batchDelete = async () => {
    const expect = usersSelection.length
    const result = await InterkitClient.call('users.delete', usersSelection)
    console.log('deleted', { expect, result })
    if (expect === result) {
      usersSelection = []
    } else {
      window.alert(`expected to delete ${expect} users, but only ${result} got deleted`)
    }
  }

  const batchMoveTo = async () => {
    const result = await InterkitClient.usersMoveTo({
      userIds: usersSelection,
      projectId,
      boardId: moveToBoardId,
      nodeId: moveToNodeId
    })
    console.log('batchMoveTo result', result)
    moveToResult  = `sucessfully moved ${result.successful.length} users, ${result.errored.length} errors`
    if (result.errored.length) {
      moveToResult += '. error ids: ' + result.errored.join(' ')
    }
  }

  const batchBlock = async setBlocked => {
    /* a block of user blocks all their messages. they can only be unblocked individually */
    if (setBlocked) {
      const resultBlockMessages = await InterkitClient.call('messages.block', {
        projectId,
        userIds: usersSelection,
        setBlocked: true
      })
    }
    const resultBlockUser = await InterkitClient.call('users.block', {
      projectId,
      userIds: usersSelection,
      setBlocked
    })
    console.log('batchBlock result', { usersSelection, setBlocked, resultBlockMessages, resultBlockUser })
  }

  const quickMsgSend = async () => {
    quickMsgResult = await InterkitClient.call('message.send', {
      projectId,
      sender: userId,
      channel_key: quickMsgChannel,
      recipients: usersSelection,
      payload: {
        type: 'text',
        text: quickMsgText
      }
    })
  }
  
</script>

{#if rows}

  <div class="UsersListTableContainer">
    <Accordion>
      <AccordionItem title="show/hide columns">
        {#each Object.keys(showCol) as colKey}
          <Checkbox bind:checked={showCol[colKey]} labelText={colKey} />
        {/each}
      </AccordionItem>
    </Accordion>
    <DataTable
      class="table"
      size="compact"
      expandable
      sortable
      batchSelection
      bind:selectedRowIds={usersSelection}
      pageSize={pagination.pageSize}
      page={pagination.page}
      {headers}
      {rows}
      >

      <Toolbar>
        <!-- currently cant use Batch Actions and Search simultaneously https://github.com/carbon-design-system/carbon/issues/2275 (has been open for ages) -->
        <!--
        <ToolbarBatchActions>
          <Button icon={Movement} on:click={() => { openMoveTo = true }}>moveTo</Button>
          <Button icon={Send} on:click={() => { openQuickMessage = true }}>Quick Message</Button>
          <Button icon={TrashCan} on:click={batchDelete}>Delete</Button>
        </ToolbarBatchActions>
        -->
        <ToolbarContent>
          <ToolbarSearch persistent value="" shouldFilterRows />
        </ToolbarContent>
      </Toolbar>

      <div slot="expanded-row" let:row>
        <b>boards:</b> {row.boards}
        <hr/>
        <pre>
          {JSON.stringify(row, null, 2)}
        </pre>
      </div>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'overflow'}
          {#if row.name != "empty"}
            <OverflowMenu style="float: right" flipped>
              <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
            </OverflowMenu>
          {/if}
        {:else if cell.key === 'usericon'}
          {#if row.id === $userId}
            &#x1F464;&#xFE0E;
          {/if}
          {#if row.id === previewUserId}
            &#x1F4F1;&#xFE0E;
          {/if}
        {:else if cell.key === 'createdAt'}
          <span title={cell.value} class="cell__1line">{ createdAtdateTimeFormat.format(cell.value) }</span>
        {:else if cell.key === 'blocked'}
          <span title="cell.value">{cell.value ? '🚫' : (cell.value === false ? '🟢' : '')}</span>
        {:else if cell.key === 'status.online'}
          <span title={(cell.value ? "online" : "offline")} class="cell__1line">{ (cell.value ? "online" : "-") }</span>
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

    {#if usersSelection.length}
      <ButtonSet>
        <Button size="small" kind="ghost" on:click={() => { window.alert(usersSelection.join(' ')) }}>{usersSelection.length} selected</Button>
        <Button size="small" icon={Movement} on:click={() => { moveToResult = ''; openMoveTo = true }}>moveTo</Button>
        <Button size="small" icon={Send} on:click={() => { openQuickMessage = true }}>Quick Message</Button>
      </ButtonSet>
      <ButtonSet>
        <Button size="small" icon={TrashCan} on:click={batchDelete}>Delete</Button>
        <Button size="small" icon={ErrorFilled} on:click={() => { batchBlock(true) }}>Block</Button>
        <Button size="small" icon={ErrorOutline} on:click={() => { batchBlock(false) }}>Unblock</Button>
      </ButtonSet>
    {/if}
  </div>

{:else}
  loading...
{/if}

<Modal
  bind:open={openQuickMessage}
  modalHeading="Quick Message"
  primaryButtonText="Send"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => { openQuickMessage = false }}
  on:submit={() => { quickMsgSend() }}
  >
  <div>…to {usersSelection.join(', ')}</div>
  <label>msg txt <input bind:value={quickMsgText} /></label>
  <label>channel <input bind:value={quickMsgChannel} /><label>
  <div>last result: {quickMsgResult}</div>
</Modal>

<Modal
  bind:open={openMoveTo}
  modalHeading="moveTo"
  primaryButtonText={moveToResult?'move again':'move'}
  secondaryButtonText={moveToResult?'done':'cancel'}
  on:click:button--secondary={() => { openMoveTo = false }}
  on:submit={() => { batchMoveTo() }}
  >
  <p>move users <b>{usersSelection.join(', ')}</b> to…</p>
  <!-- TODO make these selects -->
  <p>
    <label>boardId <input bind:value={moveToBoardId} /></label>
    <label>nodeId <input bind:value={moveToNodeId} /><label>
  </p>
  <p>hint: select a node in the chat tab to auto-fill these inputs</p>
  {#if moveToResult}
    <hr/>
    <p>{moveToResult}</p>
  {/if}
</Modal>

<style>
  .truncate {
    max-width: 10em;
    display: inline-block;
    text-align:right;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cell__1line {
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .UsersListTableContainer :global(td > span) {
    max-width: 100%;
  }

  .UsersListTableContainer :global(.bx--data-table--sticky-header) {
    /* carbon sets a stupid max height here,
       to "force a scrollbar with sticky header"
       TODO find a good size
       */
    max-height: 70vh;
  }

  .UsersListTableContainer :global(table) {
    table-layout: fixed; /* make text-overflow work + improve layout, hackily */
  }
  .UsersListTableContainer :global(.bx--table-expand__button) {
    min-width: 2em; /* table-layout fixed makes button disappear :( */
  }
  
</style>
