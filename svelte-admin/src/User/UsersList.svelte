<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import {
    Checkbox,
    Accordion,
    AccordionItem,
    DataTable,
    InlineLoading,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarBatchActions,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Button,
    ButtonSet,
    Modal,
    Pagination,
    Select,
    SelectSkeleton,
    SelectItem,
    SelectItemGroup,
    TextArea,
    Tag
  } from "carbon-components-svelte";
  import { JsonView } from '@zerodevx/svelte-json-view'


  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Send from "carbon-icons-svelte/lib/Send.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import ErrorFilled from "carbon-icons-svelte/lib/ErrorFilled.svelte";
  import ErrorOutline from "carbon-icons-svelte/lib/ErrorOutline.svelte";
  import MobileAdd from "carbon-icons-svelte/lib/MobileAdd.svelte"
  import TableSplit from "carbon-icons-svelte/lib/TableSplit.svelte"  
  import UserOnline from "carbon-icons-svelte/lib/UserOnline.svelte"

  import UserVarTableModal from './UserVarTableModal.svelte';
  import WatsonHealthStudySkip from 'carbon-icons-svelte/lib/WatsonHealthStudySkip.svelte'

  import DataTablePaginationAutofit from '../Data/DataTablePaginationAutofit.svelte'

  import SchedulingForm from '../InputModals/SchedulingForm.svelte'

  import { InterkitClient, util } from 'interkit';
  import { boardsApi } from '../BundleServer.js'
  import { genericErrorHandler, errorify } from '../apiHelpers.js'

  import { currentProjectReadOnly } from '../admin.js'

  export let users; // this should be an array, not a store
  export let projectId;
  export let previewUserId
  export let total
  export let page = 1
  export let limit = 10
  export let searchQuery = ""
  export let sortKey
  export let sortDirection
  export let loading = false

  const sortFunction = (a,b) => util.mongoSortCompare(a, b, sortKey, sortDirection)

  const dispatch = createEventDispatcher()

  let userId = InterkitClient.userId

  let usersSelection = []

  let openShowHideColumns = false

  let dataTableToolbarBatchActionsActive = false

  let openQuickMessage = false
  let quickMsgText = 'hello'
  let quickMsgIsRawPayload = false
  let quickMsgChannel
  let quickMsgResult = ''
  let quickMsgResultDate
  let quickMsgSchedulingValue

  let openMoveTo = false
  export let moveToBoardId = ''
  export let moveToNodeId = ''
  let moveToTarget = 0
  let moveToResult = ''
  let moveToResultDate
  let moveToSchedulingValue

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

  /*
  let roleAssignmentStore = null

  onMount(async () => {
    console.log("sub role-assignment")
    let sub = await InterkitClient.getSub("role-assignment", "roleAssignment")
    console.log(sub)
    roleAssignmentStore = sub.data
  })

  $: if (roleAssignmentStore) console.log($roleAssignmentStore)
  */

  const setSort = ({key, direction}) => {
    sortKey = key
    sortDirection = direction === 'ascending' ? 1 : direction === 'descending' ? -1 : 0
  }


  const trivialSort = (a, b) => a < b ? -1 : 1
  // FIXME this works only one way
  const boolSort = (a, b) => (a === b) ? 0 : a ? -1 : 1
  const alreadySorted = (a, b) => 0

  const headers = [
    {
      key: 'userIcon',
      show: true,
      value: 'Icon',
      width: '4em',
    },
    {
      key: "username",
      show: true,
      value: "Username",
      sort: alreadySorted
    },
    {
      key: "blocked",
      show: true,
      value: "Blocked",
      sort: alreadySorted
    },
    //{
    //  key: "roles",
    //  show: false,
    //  value: "Roles"
    //},
    {
      key: "id",
      show: true,
      value: "ID",
      sort: false
    },
    {
      key: "createdAt",
      show: true,
      value: "Created\u00a0at",
      sort: alreadySorted
    },
    {
      key: "status.online",
      show: true,
      value: "Online",
      width: '4em',
    },
    {
      key: "boards",
      show: true,
      value: "Boards",
      sort: false
    },
    {
      key: "userToken",
      show: true,
      value: "User\u00a0token",
      sort: false
    },
    ...(InterkitClient.userEnableHeartbeat
      ? [{ key: "lastHeartbeat", value: "Last\u00a0heartbeat", show: false, sort: trivialSort }]
      : []
    ),
    {
      key: "pushnotificationRegistrationToken",
      show: false,
      value: "Push\u00a0token"
    },
    {
      key: 'userVars',
      show: true,
      value: 'User\u00a0vars',
      sort: false
    }
  ]

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
      .sort(sortFunction)
      .map(user => {
        return {
          ...user,
          userIcon: user.id === $userId ? userIconSelf : (user.id === previewUserId ? userIconPreview : ''),
          userToken: user?.projectUserData?.[projectId]?.userToken,
          lastHeartbeat: user?.projectUserData?.[projectId]?.lastHeartbeat,
          pushnotificationRegistrationToken: user?.projectUserData?.[projectId]?.pushnotificationRegistrationToken,
          boards: summarizeBoardState(user?.projectUserData?.[projectId]?.boardState),
          userVars: JSON.stringify(user?.projectUserData?.[projectId]?.userVars),
          //roles: roleAssignmentStore && $roleAssignmentStore.reduce((acc, roleAssignment) => {
          //  if (roleAssignment.user._id === user.id) {
          //    acc.push(roleAssignment.role._id)
          //  }
          //  return acc
          //}, []).join(", ")
        }
    })
    : []
    //console.log(rows)
    //window._rows = rows
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
    const moveTo = {
      userIds: usersSelection,
      projectId,
      boardId: boards.nodes[+moveToTarget].boardId,
      nodeId: boards.nodes[+moveToTarget].nodeId
    }
    if (moveToSchedulingValue) {
      const result = await InterkitClient.call('events.schedule', {
        projectId,
        method: 'users.moveTo',
        delay: moveToSchedulingValue,
        payload: moveTo
      })
      moveToResult = '' + JSON.stringify(result)
    } else {
      const result = await InterkitClient.usersMoveTo(moveTo)
      moveToResult  = `sucessfully moved ${result.successful.length} users, ${result.errored.length} errors`
      if (result.errored.length) {
        moveToResult += '. error ids: ' + result.errored.join(' ')
      }
    }
  }

  const batchBlock = async setBlocked => {
    let resultBlockMessages
    /* a block of user blocks all their messages. they can only be unblocked individually */
    if (setBlocked) {
      resultBlockMessages = await InterkitClient.call('messages.block', {
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
    if (quickMsgIsRawPayload) {
      try {
        JSON.parse(quickMsgText)
      } catch (err) {
        console.warn('quick message send raw JSON parse test error', err)
        window.alert("Raw payload JSON invalid? Not sending.\n\n" + err)
        return
      }
    }
    const msg = {
      projectId,
      sender: userId,
      channel_key: quickMsgChannel,
      recipients: usersSelection,
      payload: quickMsgIsRawPayload
        ? JSON.parse(quickMsgText)
        : {
          type: 'text',
          text: quickMsgText
        }
    }
    if (quickMsgSchedulingValue) {
      quickMsgResult = await InterkitClient.call('events.schedule', {
        projectId,
        method: 'message.send',
        delay: quickMsgSchedulingValue,
        payload: msg
      })
    } else {
      quickMsgResult = await InterkitClient.call('message.send', msg)
    }
    // TODO remove this hack when we have proper result values
    quickMsgResult = '' + JSON.stringify(quickMsgResult)
    quickMsgResultDate = new Date()
  }

  let boards = []

  const loadBoards = async () => {
    await boardsApi(projectId, '/?nodes=1')
      .then(async res => {
        const json = await res.json()
        errorify(json)
        boards = json.result
        boards.nodes = boards.nodes.map((node, _idx) => ({ _idx, ...node }))
        if (!quickMsgChannel) quickMsgChannel = boards?.boards?.[0] || '_none'
      })
      .catch(genericErrorHandler)
  }

  $: if (openQuickMessage) loadBoards()
  $: if (openMoveTo) loadBoards()

  export let updatePreviewUserAuth;

  const previewAttach = () => {
    if(usersSelection?.length == 1) {
      const newUserId = usersSelection[0]
      console.log("previewAttach", newUserId);
      
      // find user token for this userId
      let user = users.find(u=>u._id == newUserId)
      let userToken = user?.projectUserData?.[projectId]?.userToken
      if(confirm("Warning: You are attaching a real user to the preview. Anything you do in the preview will affect this user. Proceed?")) {
        updatePreviewUserAuth({userId: newUserId, userToken});
      }
      
    }
  }

  let varEditorUser = null;
  const openUserVarEditor = () => {
    if(usersSelection?.length == 1) {
      console.log("openUserVarEditor");
      varEditorUser = users.find(u=>u._id == usersSelection[0])
    }
  }
  
</script>

{#if rows}

  <div class="UsersListTableContainer">
    <!-- TODO get f4f4f4 from carbon -->
    <DataTable
      style={`
        background: #f4f4f4;
        /* = pageSize * dense row + search/actions + thead + data table padding-top */
        min-height: ${(limit || 0) * 24 + 32 + 24 + 2}px;
      `}
      class="table"
      size="compact"
      expandable
      sortable
      on:click:header={ event => setSort({ key: event.detail.header.key, direction: event.detail.sortDirection})}
      zebra
      batchSelection
      bind:selectedRowIds={usersSelection}
      pageSize={limit}
      page={1}
      headers={headers.filter(_ => _.show)}
      {rows}
      >

      <Toolbar size="sm">
        <!--
          Batch Actions and Search simultaneously can be clunky,
          but it is still better than hacks.
          See https://github.com/carbon-design-system/carbon/issues/2275 (has been open for ages),
          closed for https://github.com/carbon-design-system/carbon/issues/11856
        -->
        <ToolbarBatchActions
          bind:active={dataTableToolbarBatchActionsActive}
          on:cancel={(evt) => {
            // do not clear selection after cancel
            evt.preventDefault()
            dataTableToolbarBatchActionsActive = false
          }}
          formatTotalSelected={num => `${num}\u00a0user${num > 1 ? 's' : ''}`}
          >
          <!--
          <Button
            size="small"
            kind="ghost"
            on:click={() => {
              window.alert('selected IDs: \n' + usersSelection.join(' '))
            }}
            >
            {usersSelection.length} selected
          </Button>
          -->
          <Button
            size="small"
            icon={WatsonHealthStudySkip}
            on:click={() => { moveToResult = ''; openMoveTo = true }}
            iconDescription="move users to a Story board/node"
            tooltipPosition="bottom"
            tooltipAlignment="start"
            disabled={$currentProjectReadOnly}
            >
            moveTo…
          </Button>
          <Button
            size="small"
            icon={Send}
            on:click={() => { openQuickMessage = true }}
            iconDescription="send message to users"
            tooltipPosition="top"
            disabled={$currentProjectReadOnly}
            >
            message…
          </Button>
          <Button
            size="small"
            icon={TableSplit}
            on:click={openUserVarEditor}
            disabled={usersSelection.length !== 1 || $currentProjectReadOnly}
            iconDescription='edit user variables'
            tooltipPosition="top"
            tooltipAlignment="end"
            >
            vars…
          </Button>
          <Button
            size="small"
            icon={MobileAdd}
            on:click={previewAttach}
            disabled={usersSelection.length !== 1}
            iconDescription='attach user to preview'
            tooltipPosition="top"
            tooltipAlignment="end"
            >
            preview
          </Button>
          <Button
            size="small"
            icon={ErrorFilled}
            on:click={() => { batchBlock(true) }}
            iconDescription="block"
            tooltipPosition="right"
            disabled={$currentProjectReadOnly}
            />
          <Button
            size="small"
            icon={ErrorOutline}
            on:click={() => { batchBlock(false) }}
            iconDescription="unblock"
            tooltipPosition="right"
            disabled={$currentProjectReadOnly}
            />
          <Button
            size="small"
            icon={TrashCan}
            on:click={batchDelete}
            iconDescription="delete"
            tooltipPosition="left"
            disabled={$currentProjectReadOnly}
            />
        </ToolbarBatchActions>
        <ToolbarContent>
          <ToolbarSearch persistent bind:value={searchQuery} placeholder="search Username, ID, User token, User vars"/>
          <InlineLoading style={`flex: 1; padding-left: 1em; visibility: ${loading ? "visible" : "hidden"}`}/>
          <ToolbarMenu>
            <ToolbarMenuItem on:click={() => { openShowHideColumns = true }}>
              toggle columns…
            </ToolbarMenuItem>
          </ToolbarMenu>
          <Button
            size="small"
            icon={Add}
            on:click={() => dispatch('clickedAddUser')}
            iconDescription="create new project user"
            tooltipPosition="top"
            tooltipAlignment="end"
            disabled={$currentProjectReadOnly}
            >
            Create…
          </Button>
        </ToolbarContent>
      </Toolbar>

      <div slot="expanded-row" let:row>
        <b>boards:</b> {row.boards}
        <hr/>
        <JsonView json={row} />
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
          <span title={(cell.value ? "online" : "offline")} class="cell__1line">
            {#if cell.value}
              <UserOnline style="vertical-align: middle" />
            {/if}
          </span>
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
    <!-- TODO: make all tables like this, adjust height calculation -->
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

<Modal
  bind:open={openQuickMessage}
  modalHeading="Message"
  primaryButtonText={quickMsgSchedulingValue ? 'Schedule' : 'Send'}
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => { openQuickMessage = false }}
  on:submit={() => { quickMsgSend() }}
  shouldSubmitOnEnter={false}
  >
  <div class="my">…to <strong>{usersSelection.length}</strong> users:</div>
  <div class="my">
    {#if !usersSelection?.length}
      please select some users
    {:else}
      {#each usersSelection.slice(0, 10) as user}
        <Tag>{user}</Tag>
      {/each}
    {/if}
    {#if usersSelection.length > 10}
      … (showing only the first 10 selected)
    {/if}
  </div>
  <div class="my">
    {#if !boards?.boards?.length}
      <SelectSkeleton />
    {:else}
      <Select labelText="target channel" bind:selected={quickMsgChannel}>
        <SelectItem value="_none" text="(none / error / wait)" />
        {#each boards.boards as boardId}
          <SelectItem
            value={boardId}
            text={
              ((boardId === moveToBoardId) ? '🟠 ' : '') +
              boardId
            }
            />
        {/each}
      </Select>
    {/if}
  </div>
  <div class="my">
    hint:
    {#if moveToBoardId}
      🟠 marks the currently selected board in the Chat tab
    {:else}
      you can select a board in the Chat tab, it will be highlighted in this dropdown
    {/if}
  </div>
  <div class="my">
    <TextArea
      bind:value={quickMsgText}
      labelText={!quickMsgIsRawPayload ? 'message text' : 'message payload JSON, must be valid!'}
      placeholder={!quickMsgIsRawPayload ? "Hello!" : '{ "type": "text", "text": "Hello!" }'}
      />
    <Checkbox bind:checked={quickMsgIsRawPayload} labelText="enter raw payload" />
  </div>
  <div class="my">
    <SchedulingForm
      bind:value={quickMsgSchedulingValue}
      />
  </div>
  {#if quickMsgResult}
    <div class="my">
      <strong>last result</strong><br/>
      at {createdAtdateTimeFormat.format(quickMsgResultDate)}<br/>
      {quickMsgResult}
    </div>
  {/if}
</Modal>

<Modal
  bind:open={openMoveTo}
  modalHeading="moveTo"
  primaryButtonText={moveToSchedulingValue ? 'Schedule' : 'move'}
  secondaryButtonText={moveToResult ? 'done' : 'cancel'}
  on:click:button--secondary={() => { openMoveTo = false }}
  on:submit={() => { batchMoveTo() }}
  >
  <div class="my">…move <strong>{usersSelection.length}</strong> users:</div>
  <div class="my">
    {#if !usersSelection?.length}
      please select some users
    {:else}
      {#each usersSelection.slice(0, 10) as user}
        <Tag>{user}</Tag>
      {/each}
    {/if}
    {#if usersSelection.length > 10}
      … (showing only the first 10 selected)
    {/if}
  </div>
  <div class="my">
    {#if !boards?.boards?.length}
      <SelectSkeleton />
    {:else}
      <Select labelText="target node" bind:selected={moveToTarget}>
        {#each boards.boards as boardId}
          <SelectItemGroup label={boardId}>
            {#each boards.nodes.filter(node => node.boardId === boardId) as node}
              <SelectItem
                value={node._idx}
                text={
                  ((node.boardId === moveToBoardId && node.nodeId === moveToNodeId) ? '🟠 ' : '') +
                  node.boardId + ' _ ' + node.nodeId
                }
                />
            {/each}
          </SelectItemGroup>
        {/each}
      </Select>
    {/if}
  </div>
  <div class="my">
    hint:
    {#if moveToBoardId && moveToNodeId}
      🟠 marks the currently selected node in the Chat tab
    {:else}
      you can select a node in the Chat tab, it will be highlighted in this dropdown
    {/if}
  </div>
  <div class="my">
    <SchedulingForm
      bind:value={moveToSchedulingValue}
      />
  </div>
  {#if moveToResult}
    <div class="my">
      <strong>last result</strong><br/>
      at {createdAtdateTimeFormat.format(moveToResultDate)}<br/>
      {moveToResult}
    </div>
  {/if}
</Modal>

<UserVarTableModal user={varEditorUser} {projectId}/>

<style>

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

  .UsersListTableContainer :global(.bx--table-header-label) {
    max-width: 100%;
  }

  /* lazy spacing hack since Svelte-Carbon doesn't have spacing helper classes yet
     https://github.com/carbon-design-system/carbon-components-svelte/issues/1066 */

  .my { /* = "margin-y" */
    margin: 1em 0;
  }
  
</style>
