<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { get } from 'svelte/store'

  import { InterkitClient } from 'interkit'

  import { docsGo } from '../docs.js'

  import { isTwinish, minimalSnippet } from './twinish.js'

  import {
    Button,
    ButtonSet,
    Tabs,
    Tab,
    TabContent,
    Accordion,
    AccordionItem,
    TreeView,
    Search,
    Grid, Row, Column
  } from "carbon-components-svelte"


  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Help from 'carbon-icons-svelte/lib/Help.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import Save from 'carbon-icons-svelte/lib/Save.svelte'
  import Copy from 'carbon-icons-svelte/lib/Copy.svelte'
  import Undo from 'carbon-icons-svelte/lib/Undo.svelte'
  import CheckmarkOutlineWarning from 'carbon-icons-svelte/lib/CheckmarkOutlineWarning.svelte'
  import WatsonHealthStudySkip from 'carbon-icons-svelte/lib/WatsonHealthStudySkip.svelte'
  import Renew from 'carbon-icons-svelte/lib/Renew.svelte'

  import { boardsApi as api } from '../BundleServer.js'
  import { genericErrorHandler, errorify } from '../apiHelpers.js'

  import MainColumns from '../Layout/MainColumns.svelte'

  import NodeGraph from './NodeGraph.svelte'
  import CodeEditor from '../Atoms/CodeEditor.svelte'
  import CodeEditorStringy from './CodeEditorStringy.svelte'
  import CodeEditorExporty from './CodeEditorExporty.svelte'
  import CodeEditorTwiny from './CodeEditorTwiny.svelte'
  import NewNodeModal from '../InputModals/NewNodeModal.svelte'
  import BoardEditModal from '../InputModals/BoardEditModal.svelte'
  import MediaFilePreview from '../Media/MediaFilePreview.svelte'

  import { idRE } from 'interkit/project-regex.js'
  import { currentProjectReadOnly } from '../admin.js'

  const dispatch = createEventDispatcher()

  let modalPanelRightOpenSet = () => { /* dummy */ }
  
  const useCodeMirror = true
  let editorMode = 2

  let unmetMoveTos

  const rectWidth = 100
  const rectHeight = 70

  import { cheatsheetContents } from './cheatsheet.js'

  const boardIdRE = new RegExp(`^${idRE}$`, 'u')
  const nodeIdRE = boardIdRE

  export let projectId

  // the following is boilerplate copied from usersmanager
  // could be centralized; or better: just subscribe to one user
  let usersStore
  let usersArray
  let subHandle
  
  let channelsStore
  let channelsSubHandle

  let unsubscribe
  
  $: resetSub(projectId)
  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('users', 'projectUsers', {projectId})
    usersStore = subHandle.data
    
    channelsSubHandle = await InterkitClient.getSub("channels", "channels", {projectId})
    channelsStore = channelsSubHandle.data;
    
    unsubscribe = usersStore.subscribe((data) => {
      //console.log("project users", data)
      usersArray = data;
    })
  }

  onDestroy(() => {
    if(unsubscribe) unsubscribe()
  });

  // force update of the SVG hack
  // TODO: some sort of debounce
  let _update = 0

  export let previewUserId

  let userNodes = []
  const updateUserNodes = () => {
    userNodes = usersArray?.map(user => {
      const boardState = user.projectUserData?.[projectId]?.boardState?.[currentBoardId]
      const atNode = boardState ? board?.nodes.find(node => node.id === boardState.nodeId) : undefined
      const rndSeed = [(((+user.createdAt) & 0xff00) >> 8) / 256, ((+user.createdAt) & 0xff) / 256]
      return {
        //user,
        id: user.id,
        boardState,
        atNode,
        rndSeed,
        isPreviewUser: user.id === previewUserId
      }
    }) || []
  }

  $: usersArray, projectId, currentBoardId, board, previewUserId, updateUserNodes()

  let editMode = false

  let editNodeId = null

  $: if (editNodeId) modalPanelRightOpenSet(true)

  let copyEditNodeId

  const setCurrentBoardData = (boardData) => {
    currentBoardData = boardData
  }

  let boards = []
  let boardsLoaded = false;
  let board = null
  let currentBoardId = null

  $: if (currentBoardId) {
    loadBoard(currentBoardId) 
  } else {
    board = null
  }

  $: currentBoardId, (() => { editNodeId = null })()

  $: currentBoardId, editNodeId, (() => { dispatch('nodeselected', { boardId: currentBoardId, nodeId: editNodeId }) })()

  const twinyHintIcons = {
    // \ufe0e doesn't really work here
    'sync': '\u2713',
    'broken': '\u2717',
    'unknown': '\u2047',
    'none': ''
  }
  let twinyHint = ''

  let editorContents
  let copyEditorContents
  $: currentBoardId, editNodeId, board, updateEditorContents()

  const updateEditorContents = () => {
    editorContents = board?.nodes?.find(node => node.id === editNodeId)?.contents
    // console.log('updateEditorContents', { editNodeId, editorContents })
    /*
    twinyHint = typeof editorContents === 'string'
      ? (editorContents.indexOf('twinterkitSource') > -1 ? 'yes' : 'no')
      : '...'
    */
    twinyHint = isTwinish(editorContents)
    // twinyHintIcon = twinyHintIcons[twinyHint] || ''
    if (twinyHint === 'sync') editorMode = 3
  }

  let nodeGraph

  $: editorContents, (() => {
    twinyHint = isTwinish(editorContents)
    const node = board?.nodes?.find(node => node.id === editNodeId)
    if (node) {
      if (node.contents !== editorContents) {
        // only save the fresh, unmodified after-save/load contents
        if (!node.modified) {
          node._originalContents = node.contents
        }
        // console.log('set modified', node)
        node.modified = true
        updateNodesModified()
      }
      node.contents = editorContents;
      ({ unmetMoveTos } = nodeGraph.updateConnections())
    }
    updateNodeMetadata()
  })()

  let nodesModifiedCount = 0
  let editNodeModified = false
  const updateNodesModified = () => {
    // I failed to do this idiomatically reactive
    nodesModifiedCount = board?.nodes?.filter(node => node.modified).length
    editNodeModified = board?.nodes?.find(node => node.id === editNodeId)?.modified
    console.log('NodeEditor updateNodesModified', { nodesModifiedCount, editNodeModified })
    _update++
  }
  $: editNodeId, updateNodesModified()

  const updateNodeMetadata = () => {
    board?.nodes?.forEach(node => {
      // node._color = Math.random()
    })
    _update++
  }

  const refresh = async () => {
    if (nodesModifiedCount) {
      if (window.confirm('Your unsaved changes to nodes will be lost. Continue?') !== true) {
        return
      }
    }
    if (currentBoardId) {
      await loadBoard(currentBoardId)
    }
    await loadBoardList()
  }

  // checks if there is a channel for each board
  const boardChannelSync = () => {
    console.log("boardChannelSync", $channelsStore, boards)
    // get channels collection
    let channels = get(channelsStore)
    for(let board of boards) {
      if(!channels?.some(c => c.channel_key == board.id)) {
        console.log("channel for board not found, creating...", board)
        InterkitClient.call("channel.create", {channel_key: board.id, projectId})
      } else {
        console.log("channel found", board.id)
      }
    }

    for(let channel of channels) {
      if(boardsLoaded && !boards.some(_ => _.id === channel.channel_key)) {
        console.log("board not found for channel, deleting", channel.channel_key)
        InterkitClient.call("channel.delete", {channel_key: channel.channel_key, projectId})
      }
    }
  }

  let currentChannel
  const updateChannel = (channels, _channel_key) => {
    currentChannel = channels.find(c => c.channel_key === _channel_key)
    console.log("currentChannel", currentChannel)
  }

  $: if ($channelsStore && currentBoardId) updateChannel($channelsStore, currentBoardId)
  $: if ($channelsStore && boards && boardsLoaded) boardChannelSync()

  const loadBoardList = async () => {
    await api(projectId, '/?nodes=tree')
      .then(async res => {
        const json = await res.json()
        errorify(json)
        boards = json.result
        console.log('loadBoardList', boards)
        boardsLoaded = true;
      })
      .catch(genericErrorHandler)
  }

  const processBoard = board => {
    if (!Array.isArray(board.nodes))
      board.nodes = []
    board.nodes.forEach(node => {
      if (isNaN(node.posX)) node.posX = 10
      if (isNaN(node.posY)) node.posY = 10
      if (typeof node.id !== 'string')
        node.id = 'node_' + Math.random().toString(36).substr(2)
      return node
    })
    return board
  }

  const loadBoard = boardId => {
    return api(projectId, '/' + boardId)
      .then(async res => {
        const json = await res.json()
        errorify(json)
        board = processBoard(json.result)
        console.log("loadBoard", board)
      })
      .catch(genericErrorHandler)
  }

  const createBoard = () => {
    let c = 0
    let newBoardId
    let newBoardIdDefault
    while (!newBoardIdDefault || (boards.some(_ => _.id === newBoardIdDefault) && c < 1000)) {
      c++
      newBoardIdDefault = 'board' + c
    }
    while (newBoardId === undefined || !boardIdRE.test(newBoardId)) {
      newBoardId = window.prompt('Please enter an ID for the new board. You can use letters, numbers, dashes, spaces, but no underscores.', newBoardId || newBoardIdDefault)
    }
    if (newBoardId === null) return
    api(projectId, '/' + newBoardId, { method: 'post' })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        await loadBoardList()
        await loadBoard(newBoardId)
        currentBoardId = newBoardId
      })
      .catch(genericErrorHandler)
  }

  const deleteCurrentBoard = () => {
    if (window.confirm('really?') === false) {
      return
    }
    deleteBoard(currentBoardId)
  }

  const deleteBoard = boardId => {
    api(projectId, '/' + boardId, { method: 'delete' })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        if (currentBoardId === boardId) currentBoardId = null
        board = []
        loadBoardList()
        //InterkitClient.call("channel.delete", {channel_key: boardId, projectId})
      })
      .catch(genericErrorHandler)
  }

  const saveCurrentBoard = ({ doPatch }) => {
    saveBoard(currentBoardId, board, { doPatch })
  }

  const saveBoard = (boardId, data, { doPatch }) => { 
    // create a clone of the board, but purge contents
    // note: could break if the structure gets deeper than 1 level
    let body = {
      ...data,
      nodes: data.nodes.map(node => {
        const n = { ...node }
        delete n.contents
        return n
      })
    }
    body = JSON.stringify(body)
    api(projectId, '/' + boardId, { method: doPatch ? 'PATCH' : 'put', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        // loadBoard(boardId)
      })
      .catch(genericErrorHandler)
  }

  let showNewNodeModal = false
  let newNodeId
  let newNodeContent
  let newNodeSelectedTemplate

  const submitNewNodeModal = () => {
    if (!newNodeContent) {
      window.alert('no content provided')
      return
    }
    if (!nodeIdRE.test(newNodeId)) {
      window.alert('You can use letters, numbers, dashes, spaces, but no underscores.')
    } else {
      createNode(currentBoardId, newNodeId, newNodeContent)
      showNewNodeModal = false
    }
  }

  let copyCurrentNodeHinted = false
  const copyCurrentNode = () => {
    copyEditNodeId = currentBoardId + ' _ ' + editNodeId
    copyEditorContents = editorContents
    if (!copyCurrentNodeHinted) {
      window.alert('you can now click \"new/paste node\" and select the node you just copied')
      copyCurrentNodeHinted = true
    }
  }

  const createNodeInCurrentBoard = (newNodeIdBase = 'node') => {
    if (nodesModifiedCount) {
      if (window.confirm('you have to save nodes first')) {
        saveModifiedNodes()
      } else {
        return
      }
    }
    let c = 0
    newNodeId = newNodeIdBase
    while ((board.nodes.findIndex(node => node.id === newNodeId) > -1) && (c < 1000)) {
      c++
      newNodeId = newNodeIdBase + c
    }
    showNewNodeModal = true
  }

  const createNode = async (boardId, name, body) => { 
    console.log('createNode', body)
    const nextToNode = board?.nodes?.find(_ => _.id === editNodeId)
    const qs = `?posX=${nextToNode?.posX + rectWidth + 20 || 0}&posY=${nextToNode?.posY + rectHeight + 20 || 0}`
    const posX = nextToNode?.posX 
    const posY = nextToNode?.posY
    api(projectId, `/${boardId}/nodes/${name}/${qs}`, { method: 'post', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
      })
      .catch(genericErrorHandler)
      .finally(async () => {
        await loadBoard(boardId)
        // select the new node if it was created successfully
        if (board?.nodes?.find(_ => _.id === name)) {
          editNodeId = name
        }
      })
  }

  const deleteCurrentNode = () => {
    if (window.confirm('really?') === false) {
      return
    }
    deleteNode(currentBoardId, editNodeId)
  }

  const deleteNode = (boardId, nodeId) => {
    api(projectId, `/${boardId}/nodes/${nodeId}`, { method: 'delete' })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        if (editNodeId === nodeId) editNodeId = null
        loadBoard(boardId)
      })
      .catch(genericErrorHandler)
  }

  const saveCurrentNode = () => {
    syntaxCheck()
    if(syntaxCheckStatus == 'ok') {
      saveNode(currentBoardId, editNodeId, editorContents)
    } else {
      alert("Cannot save, there are syntax errors in your code.")
    }
  }

  const restoreCurrentNode = () => {
    const node = board?.nodes?.find(_ => _.id === editNodeId)
    if (!node) {
      window.alert(`node ${editNodeId} not found, cannot restore`)
      return
    }
    editorContents = node._originalContents
    delete node._originalContents
    node.modified = false
    updateNodesModified()
  }

  const saveModifiedNodes = () => {
    let modifiedNodes = board?.nodes.filter(node => node.modified)
    console.log("modifiedNodes", modifiedNodes)
    let errorNodes = []
    for(let node of modifiedNodes) {
      let result = syntaxCheck(node.contents)
      if(result.status == "ok") {
        saveNode(currentBoardId, node.id, node.contents)
      } else {
        errorNodes.push(node.id)
      }
    }
    if(errorNodes.length) {
      console.log(errorNodes)
      alert("errors in nodes: " + errorNodes.join(", "))
    }
  }

  const saveNode = (boardId, nodeId, body) => {
    api(projectId, `/${boardId}/nodes/${nodeId}`, { method: 'put', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        const node = board?.nodes?.find(_ => _.id === nodeId)
        if (node) {
          console.log('set modified false', node)
          node.contents = json.result
          node._originalContents = ''
          node.modified = false
          updateNodesModified()
          if (editNodeId === nodeId) updateEditorContents()
        }
      })
      .catch(genericErrorHandler)
  }

  const renameCurrentNode = async () => {
    if (nodesModifiedCount) {
      window.alert('Please save all nodes first.')
      return
    }
    const newNodeId = window.prompt('new name', editNodeId)
    if (!newNodeId) {
      window.alert('No name provided.')
      return
    }
    if (newNodeId === editNodeId) {
      window.alert('No change.')
      return
    }
    if (board?.nodes?.find(node => node.id === newNodeId)) {
      if (window.confirm(`There already exists a node with the name '${newNodeId}', renaming will overwrite it. Continue?`) !== true) {
        return
      }
    }
    await renameNode(currentBoardId, editNodeId, newNodeId)
    editNodeId = newNodeId
  }

  const renameNode = async (boardId, oldNodeId, newNodeId) => { 
    api(projectId, `/${boardId}/renamenode/${oldNodeId}/${newNodeId}`, { method: 'put' })
      .then(async res => {
        const json = await res.json()
        errorify(json)
      })
      .catch(genericErrorHandler)
      .finally(() => { loadBoard(boardId) })
  }

  const renameBoard = async (oldBoardId, newBoardId) => {
    return api(projectId, `/renameboard/${oldBoardId}/${newBoardId}`, { method: 'put' })
      .then(async res => {
        const json = await res.json()
        errorify(json)
      })
      .then(() => {
        try {
          // attention, please manually sync this magic string + props with NodeGraph
          ['offsetX', 'offsetY', 'zoom'].forEach(prop => {
            const oldLSkey = `interkit-admin-node-boardview-${projectId}-${oldBoardId}-${prop}`
            const newLSkey = `interkit-admin-node-boardview-${projectId}-${newBoardId}-${prop}`
            localStorage.setItem(newLSkey, localStorage.getItem(oldLSkey))
            localStorage.removeItem(oldLSkey)
          })
        } catch (e) {
          console.warn('renameBoard: error updating localStorage keys', e)
        }
        if (currentBoardId === oldBoardId) {
          currentBoardId = newBoardId
        }
      })
      .catch(genericErrorHandler)
      .finally(async () => {
         await loadBoardList()
      })
  }

  const moveTo = async () => {
    console.log("moveTo", editNodeId, previewUserId, currentBoardId)
    const usersMovedCount = InterkitClient.call("user.moveTo", {
      projectId,
      userId: previewUserId,
      boardId: currentBoardId,
      nodeId: editNodeId
    })
    console.log(`moveTo: moved ${usersMovedCount} users`)
  }

  let syntaxCheckMessage = ''
  let syntaxCheckStatus = ''

  $: editorContents, () => { syntaxCheckMessage = ''; syntaxCheckStatus = '' }

  // checks syntax
  // if no code is passed in, checks the current node's code and displays message
  // if code is passed in, returns the result
  const syntaxCheck = (_code) => {
    console.log("syntaxCheck with", _code)
    let code = _code ? _code : editorContents;
    // export are only allowed in modules
    code = code.replace(/^\s*export\b/gm, '/*xprt*/')

    // comment out parts that should not be checked
    code = code.replace('//no-check-start', '/*')
    code = code.replace('//no-check-end', '*/')
  
    let _syntaxCheckStatus;
    let _syntaxCheckMessage;

    try {
      eval(code)
      _syntaxCheckStatus = 'ok'
      _syntaxCheckMessage = 'no <i>syntactical</i> errors<br/><small>errors still might occur when the code runs</small>'
    } catch (err) {
      _syntaxCheckStatus = 'bad'
      _syntaxCheckMessage = `<b>${err.message}</b>`
      if (err.lineNumber) {
        _syntaxCheckMessage += `<br/>at line <b>${err.lineNumber}</b>`
        if (err.columnNumber) _syntaxCheckMessage += `, column <b>${err.columnNumber}</b>`
      }
      if (err.stack) {
        _syntaxCheckMessage += `<pre>${err.stack}</pre>`
      }
    }

    if(!_code) {
      syntaxCheckStatus = _syntaxCheckStatus
      syntaxCheckMessage = _syntaxCheckMessage
    } else {
      return {status: _syntaxCheckStatus, message: _syntaxCheckMessage}
    }
  }

  let showBoardEditModal = false

  const startBoardEdit = () => {
    showBoardEditModal = true
  }

  const saveBoardMeta = async data => {
    let newBoardId
    if (data.name !== currentBoardId) {
      newBoardId = data.name
      await renameBoard(currentBoardId, newBoardId)
    }
    ['title', 'label', 'image'].forEach(property => {
      // if (typeof data[property] !== 'string') return
      InterkitClient.call('channel.setProperty', {
        projectId,
        channel_key: newBoardId || currentBoardId,
        property,
        value: data[property]
      })
    })
  }

  let treeView

  let search = ''
  let searchHighlightNodeIds = []

  $: {
    searchHighlightNodeIds = board?.nodes
      ?.filter(node =>
        node.id?.toLowerCase()?.includes(search.toLowerCase()) ||
        node.contents?.toLowerCase()?.includes(search.toLowerCase())
      )
      ?.map(node => node.id)
    if (search && treeView) treeView.expandAll()
  }
 
  onMount(async () => {
    await loadBoardList();
    if (boards.length) currentBoardId = boards[0].id
  })

</script>

<MainColumns
  sidebarLeftLabel="Story"
  modalPanelRightLabel={editNodeId || '(node)'}
  bind:modalPanelRightOpenSet
  rootClass="NodeEditor"
  >
  <svelte:fragment slot="sidebarLeft">
    <!--
    <ButtonSet>
      <Button
        kind="ghost"
        icon={WatsonHealthRotate_360}
        iconDescription="refresh"
        size="small"
        on:click={refresh}
        />
    </ButtonSet>
    -->
    <Search
      placeholder={`Search ${currentBoardId}…`}
      disabled={!currentBoardId}
      bind:value={search}
      />
    <TreeView
      style="cursor: default"
      bind:this={treeView}
      children={boards
        ?.filter(b => !search || b.id === currentBoardId)
        ?.map(b => ({
          id: b.id,
          text: b.id,
          children: b.nodes
            ?.filter(n => !search || searchHighlightNodeIds.includes(n.id))
            ?.map(n => ({
              id: b.id + '_' + n.id,
              text: n.id,
            }))
        }))
      }
      on:select={({ detail }) => {
        if (detail.id.indexOf('_') === -1) {
          currentBoardId = detail.id
        } else {
          let nodeId
          // [currentBoardId, editNodeId] = detail.id.split('_')
          [currentBoardId, nodeId] = detail.id.split('_')
          nodeGraph.scrollNodeIntoView(nodeId)
        }
      }}
      />
    <hr />
    <ButtonSet><!-- style="justify-content: end" -->
      <Button
        kind="ghost"
        iconDescription="refresh"
        size="small"
        style="color: black; font-weight: 500; width: 100%"
        on:click={createBoard}
        icon={Add}
        disabled={$currentProjectReadOnly}
        >
        New Board
      </Button>
    </ButtonSet>
  </svelte:fragment>
  <svelte:fragment slot="contentMain">
    <div class="contentMain">
      <div class="contentMainHeader">
        <div>
          <div class="boardHeader">
            <div class="boardHeaderIcon">
              {#if board && currentChannel?.image?.value}
                <MediaFilePreview
                  {projectId}
                  key={currentChannel?.image?.value}
                  />
              {:else}
                <div class="boardHeaderIconPlaceholder"></div>
              {/if}
            </div>
            <h2 class="boardHeaderHeading">
              {board ? currentBoardId : '—'}
            </h2>
            <div class="boardHeaderSubtitle">
              Title: {currentChannel?.title || '—'}
              Label: {currentChannel?.label || '—'}
            </div>
          </div>
          <ButtonSet style="justify-content: end">
            <Button
              icon={Help}
              kind="ghost"
              on:click={() => docsGo('/guides/overview/interface_overview#story')}
              >Help</Button>
            <Button
              kind="ghost"
              icon={TrashCan}
              iconDescription="delete board"
              disabled={!board || $currentProjectReadOnly}
              on:click={deleteCurrentBoard}
              />
            <Button
              kind="ghost"
              icon={Edit}
              iconDescription="edit board title, icon, label"
              on:click={startBoardEdit}
              disabled={!board}
              />
            <Button
              kind="ghost"
              icon={Renew}
              iconDescription="refresh"
              on:click={refresh}
              />
            {#if nodesModifiedCount > 0}
              <Button
                kind="secondary"
                on:click={saveModifiedNodes}
                disabled={!nodesModifiedCount || $currentProjectReadOnly}
                icon={Save}
                >
                Save {nodesModifiedCount} nodes
              </Button>
            {/if}
            <Button
              icon={Add}
              on:click={() => { createNodeInCurrentBoard() }}
              disabled={!board || $currentProjectReadOnly}
              >
              New Node
            </Button>
          </ButtonSet>
        </div>
      </div>
      <div class="contentMainNodeGraph">
        {#if board}
          <NodeGraph
            {projectId}
            boardId={currentBoardId}
            bind:board
            nodes={board.nodes}
            {_update}
            {userNodes}
            {previewUserId}
            on:nodemoved={() => { saveCurrentBoard({ doPatch: true }); updateUserNodes() }}
            on:nodeclicked={modalPanelRightOpenSet(true)}
            bind:editNodeId
            {rectWidth}
            {rectHeight}
            bind:this={nodeGraph}
            />
        {:else}
          <div class="nodegraph"></div>
        {/if}
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="modalPanelRightHeaderActions">
    {#if editNodeId}
      <ButtonSet>
        <!-- TODO/FIXME:
          When there is not enough horizontal viewport, currently at <1200px,
          this is really hard/impossible to make scroll horizontally,
          or force the child buttons to shrink in width.
          A proper solution should collapse this into a ⋮ menu.
        -->
        <Button
          kind="ghost"
          on:click={moveTo}
          icon={WatsonHealthStudySkip}
          iconDescription="Move preview user to node"
          tooltipPosition="top"
          disabled={!board || !editNodeId}
          />
        <Button
          kind="ghost"
          on:click={restoreCurrentNode}
          disabled={!board || !editNodeId || !editNodeModified }
          icon={Undo}
          iconDescription="Restore node"
          tooltipPosition="top"
          />
        <Button
          kind="ghost"
          on:click={renameCurrentNode}
          disabled={!board || !editNodeId || $currentProjectReadOnly}
          icon={Edit}
          iconDescription="Rename node"
          tooltipPosition="top"
          />
        <Button
          kind="ghost"
          on:click={() => { syntaxCheck() }}
          disabled={!board || !editNodeId}
          icon={CheckmarkOutlineWarning}
          iconDescription="Check syntax"
          tooltipPosition="top"
          />
        <Button
          kind="ghost"
          on:click={() => { copyCurrentNode() }}
          icon={Copy}
          iconDescription="Copy node"
          tooltipPosition="top"
          disabled={!editNodeId || $currentProjectReadOnly}
          />
        <Button
          kind="ghost"
          on:click={deleteCurrentNode}
          disabled={!board || !editNodeId || $currentProjectReadOnly}
          icon={TrashCan}
          iconDescription="Delete node"
          tooltipPosition="top"
          />
        <Button
          on:click={saveCurrentNode}
          disabled={!board || !editNodeId || !editNodeModified || $currentProjectReadOnly}
          icon={Save}
          >
          Save
        </Button>
      </ButtonSet>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="modalPanelRight">
    <div style="display: flex; flex-direction: column; height: 100%">
      <div style="display: flex">
        <Tabs
          bind:selected={editorMode}
          autoWidth={true}
          >
          <Tab label="Strings" />
          <Tab label="Handlers" />
          <Tab label="Full" />
          <Tab label={`Twine-ish${twinyHintIcons[twinyHint] || ''}`} />
        </Tabs>
        <Button
          style="margin-left: auto"
          kind="ghost"
          icon={Help}
          on:click={() => docsGo('/reference/chat/story_cheatsheet#' + ['javascript', 'javascript', 'javascript', 'twine-ish-syntax'][editorMode])}
          size="small"
          iconDescription="syntax cheatsheet"
          tooltipAlignment="end"
          />
      </div>
    <!-- can't use TabContent here, need if/else so only one of the editors is actually mounted at a time,
      otherwise two-way binds are a hot mess -->
        <div style="overflow: auto; display: flex; flex-direction: column"><!-- wrapper for CodeMirror(s) -->
        {#if editorMode !== 3 && twinyHint === 'sync'}
          <div class="textlike">
            <p>
              <strong>Warning:</strong> This node contains twine-ish code.
              If you don't edit it via the Twine-ish tab,
              you can break it.
            </p>
            <p>
              <Button
                on:click={() => { editorMode = 3 }}
                kind="tertiary"
                size="small"
                style="margin: 0.5em auto"
                >
                Switch to Twine-ish tab
              </Button>
            </p>
          </div>
        {/if}
        {#if editorMode === 0}
          <CodeEditorStringy
            class="editor"
            readOnly={$currentProjectReadOnly}
            bind:code={editorContents}
            />
        {:else if editorMode === 1}
          <CodeEditorExporty
            code={editorContents}
            readOnly={$currentProjectReadOnly}
            on:codechange={evt => { editorContents = evt.detail }}
            />
        {:else if editorMode === 2}
          {#if useCodeMirror}
            <CodeEditor
              code={editorContents}
              on:codechange={evt => { editorContents = evt.detail }}
              readOnly={$currentProjectReadOnly}
              class="editor"
              />
          {:else}
            <textarea
              class="editor"
              bind:value={editorContents}
              disabled={editorContents === null || $currentProjectReadOnly}
              />
          {/if}
        {:else if editorMode === 3}
          {#if twinyHint === 'sync'}
            <CodeEditorTwiny
              code={editorContents}
              readOnly={$currentProjectReadOnly}
              on:codechange={evt => { editorContents = evt.detail }}
              class="editor"
              />
          {:else}
            <div class="textlike">
              {#if twinyHint === 'broken'}
                <p>This node contains twine-ish code, but it is broken.
                  Maybe somebody edited it manually.</p>
              {:else if twinyHint === 'none'}
                <p>This node does not contain twine-ish code.</p>
              {/if}
              <Button 
                on:click={() => { editorContents = minimalSnippet }}
                disabled={$currentProjectReadOnly}
              >twinify</Button>
              <p>Warning: this will overwrite this node's contents</p>
            </div>
          {/if}
        {/if}
        </div>
      {#if syntaxCheckMessage}
        <div class={`syntaxcheck syntaxcheck__status-${syntaxCheckStatus}`}>
          {@html syntaxCheckMessage}
        </div>
      {/if}
      {#if unmetMoveTos && editNodeId && unmetMoveTos[editNodeId]}
        <div class="textlike">
          <p>create nodes for dangling <code>moveTo</code>s:</p>
          <ButtonSet stacked>
          {#if nodesModifiedCount}
            <!--<p><strong>You have to save all nodes first</strong></p>-->
            <Button
              icon={Save}
              kind="secondary"
              size="small"
              on:click={() => { saveModifiedNodes() }}
              >
              Save all nodes to enable
            </Button>
          {/if}
          {#each unmetMoveTos[editNodeId] as unmetMoveTo}
            <Button
              kind="tertiary"
              icon={Add}
              size="small"
              disabled={nodesModifiedCount}
              on:click={() => { createNodeInCurrentBoard(unmetMoveTo) }}
              >
              {unmetMoveTo}
            </Button>
          {/each}
          </ButtonSet>
        </div>
      {/if}
      <!-- TODO move cheatsheet to right docs sidebar
        {#if useCodeMirror}
          <p>Cheatsheet (click to activate)</p>
          <CodeEditor code={cheatsheetContents} readOnly={true} class="cheatsheet" />
        {:else}
          <textarea
            class="cheatsheet"
            value={cheatsheetContents}
            readonly="readonly"
            />
        {/if}
      -->
    </div>
  </svelte:fragment>
</MainColumns>

{#if showNewNodeModal}
  <NewNodeModal
    bind:templateText={newNodeContent}
    bind:nodeId={newNodeId}
    bind:selected={newNodeSelectedTemplate}
    {editNodeId}
    close={() => { showNewNodeModal = false }}
    submit={submitNewNodeModal}
    dynamicTemplates={
      [
        copyEditNodeId && copyEditorContents
          ? {
            label: `clone of node: ${copyEditNodeId}`,
            value: copyEditorContents
          } : {
            label: '(clone of a copied node)',
            value: '// please select a node, click "copy node", and its content will appear here'
          }
      ]
    }
    />
{/if}

<BoardEditModal
  {projectId}
  bind:open={showBoardEditModal}
  name={currentBoardId}
  channel={currentChannel}
  on:submit={({ detail }) => saveBoardMeta(detail)}
  />

<style>

:global(.NodeEditor) :global(.nodegraph) {
  background: white;
  /* box-shadow: inset 0.2em 0.2em 0.2em rgba(0, 0, 0, 0.2); */
  width: 100%;
  height: 100%;
}

.contentMain {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.contentMainHeader {
  flex-shrink: 0;
  flex-grow: 0;
  border-bottom: 1px solid #ccc;
}

.contentMainNodeGraph {
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: auto;
}

/*
.editor {
  display: block;
  width: 100%;
  height: calc(100% - 2.5rem);
}
*/

.cheatsheet {
  grid-area: right;
  width: 100%;
  border: 1px solid #aaa;
}

.syntaxcheck {
  background: white;
  border: solid #888 1px;
  border-left-width: 4px;
  margin: 1em 0;
  padding: 0.5em;
}

.syntaxcheck :global(b) {
  font-weight: bold;
}

.syntaxcheck :global(pre) {
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 5em;
  overflow-y: scroll;
  font-size: 80%;
  margin-top: 0.5em;
}

.syntaxcheck__status-ok {
  border-left-color: green;
}

.syntaxcheck__status-bad {
  border-left-color: red;
}

:global(.NodeEditor) :global(.CodeMirror) {
  /* height: calc(100% - 2.5rem) !important; */
}

:global(.bx--btn-set) :global(.bx--btn) {
  width: auto;
}

:global(.bx--tree) :global(.bx--tree-node) {
  background: transparent;
}

/* hack to fix disabled buttons having a darker left border */
:global(.bx--btn-set .bx--btn.bx--btn--disabled) {
  box-shadow: -0.0625rem 0 0 0 #e0e0e0;
}

.boardHeader {
  display: grid;
  grid-template-columns: 3em auto;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "bHicon bHheading" 
    "bHicon bHsub";
  column-gap: 0.5em;
  padding: 0.5em; /* TODO */
}

.boardHeaderIcon {
  grid-area: bHicon;
}

.boardHeaderIcon :global(.preview-image),
.boardHeaderIconPlaceholder {
  width: 3em;
  height: 3em;
  object-fit: cover;
  border-radius: 0.5em;
  background-color: rgba(0, 0, 0, 0.3);
  max-height: none !important;
}

.boardHeaderHeading {
  grid-area: bHheading;
  font-size: 1.25rem;
}

.boardHeaderSubtitle {
  grid-area: bHsub;
  font-size: 0.75rem;
  color: #888; /* TODO */
}

hr {
  border: none;
  height: 1px;
  background-color: #eee; /* TODO */
  margin: 0.5em 16px; /* 16px spied from carbon */
}

.textlike {
  padding: 0 1em;
}

.textlike p {
  margin: 1em 0;
}

</style>
