<script>

  import { onMount, onDestroy } from 'svelte'

  import { InterkitClient } from 'interkit'

  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  import { boardsApi as api } from './BundleServer.js'

  import NodeGraph from './NodeGraph.svelte'
  import CodeEditor from './CodeEditor.svelte'
  import NodeEditorNewNodeModal from './NodeEditorNewNodeModal.svelte'

  const useCodeMirror = true

  // TODO this could be centralized somewhere.
  // theoretically, usefully between admin AND bundler,
  // e.g. to be used in server.mjs for validation
  const boardIdRE = /^[a-z0-9]+$/
  const nodeIdRE = boardIdRE

  export let projectId

  // the following is boilerplate copied from usersmanager
  // could be centralized; or better: just subscribe to one user
  let usersStore
  let unsubscribe
  let usersArray
  let subHandle
  $: resetSub(projectId)
  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('users', 'projectUsers', {projectId})
    usersStore = subHandle.data
    unsubscribe = usersStore.subscribe((data) => {
      console.log("project users", data)
      usersArray = data;
    })
  }

  onDestroy(unsubscribe);

  export let previewUserId

  let userNodes = []
  const updateUserNodes = () => {
    userNodes = usersArray?.map(user => {
      const boardState = user.projectUserData?.[projectId]?.boardState?.[currentBoardId]
      const atNode = boardState ? board?.nodes.find(node => node.id === boardState.nodeId) : undefined
      return {
        //user,
        id: user.id,
        boardState,
        atNode,
        isPreviewUser: user.id === previewUserId
      }
    })
  }

  $: usersArray, projectId, currentBoardId, board, previewUserId, updateUserNodes()

  const genericErrorHandler = error => {
    let msg = ''
    if (!error) {
      msg = 'unknown error'
    } else {
      if (error.error) msg += error.error + '\n'
      if (error.errorMessage) msg += error.errorMessage + '\n'
      if (error.message) msg += error.message + '\n'
    }
    window.alert(msg)
    console.error(error)
  }

  const errorify = response => {
    if (!response.errors) return
    if (Array.isArray(response.errors)) {
      if (response.errors.length === 0) return
      throw response.errors[0]
    } else {
      throw response.errors
    }
  }

  let editMode = false

  let editNodeId = null

  const setCurrentBoardData = (boardData) => {
    currentBoardData = boardData
  }

  let boards = []
  let board = null
  let currentBoardId = null

  $: if (currentBoardId) {
    loadBoard(currentBoardId) 
  } else {
    board = null
  }

  $: currentBoardId, (() => { editNodeId = null })()

  let editorContents
  $: currentBoardId, editNodeId, updateEditorContents()

  const updateEditorContents = () => {
    editorContents = board?.nodes?.find(node => node.id === editNodeId)?.contents
  }

  let nodeGraph

  $: editorContents, (() => {
    const node = board?.nodes?.find(node => node.id === editNodeId)
    if (node) {
      if (node.contents !== editorContents) {
        console.log('set modified', node)
        node.modified = true
      }
      node.contents = editorContents
      nodeGraph.updateConnections()
    }
  })()

  const refresh = async () => {
    if (currentBoardId) {
      await loadBoard(currentBoardId)
    }
    await loadBoardList()
  } 

  const loadBoardList = () => {
    api(projectId, '/')
      .then(async res => {
        const json = await res.json()
        errorify(json)
        boards = json.result
        console.log('loadBoardList', boards)
      })
      .catch(genericErrorHandler)
  }

  const processBoard = board => {
    if (!Array.isArray(board.nodes))
      board.nodes = []
    if (!board.offsetX) board.offsetX = 0
    if (!board.offsetY) board.offsetY = 0
    if (!board.zoom) board.zoom = 1.0
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
    api(projectId, '/' + boardId)
      .then(async res => {
        const json = await res.json()
        errorify(json)
        board = processBoard(json.result)
      })
      .catch(genericErrorHandler)
  }

  const createBoard = () => {
    let c = 0
    let newBoardId
    let newBoardIdDefault
    while (!newBoardIdDefault || (boards.indexOf(newBoardIdDefault) > -1 && c < 1000)) {
      c++
      newBoardIdDefault = 'board' + c
    }
    while (newBoardId === undefined || !boardIdRE.test(newBoardId)) {
      newBoardId = window.prompt('Please enter an ID for the new board. You can use letters a-z and numbers 0-9, no dashes, underscores, spaces or other characters.', newBoardId || newBoardIdDefault)
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
      })
      .catch(genericErrorHandler)
  }

  const saveCurrentBoard = () => {
    saveBoard(currentBoardId, board)
  }

  const saveBoard = (boardId, data) => { 
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
    api(projectId, '/' + boardId, { method: 'put', body })
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

  const submitNewNodeModal = () => {
    if (!newNodeContent) {
      window.alert('no content provided')
      return
    }
    if (!nodeIdRE.test(newNodeId)) {
      window.alert('You can use letters a-z and numbers 0-9, no dashes, underscores, spaces or other characters.')
    } else {
      createNode(currentBoardId, newNodeId, newNodeContent)
      showNewNodeModal = false
    }
  }

  const createNodeInCurrentBoard = () => {
    let c = 0
    let newNodeIdDefault
    while (!newNodeIdDefault || (board.nodes.findIndex(node => node.id === newNodeIdDefault) > -1 && c < 1000)) {
      c++
      newNodeIdDefault = 'node' + c
    }
    showNewNodeModal = true
    newNodeId = newNodeIdDefault
    // while (newNodeId === undefined || !nodeIdRE.test(newNodeId)) {
    //   newNodeId = window.prompt('Please enter an ID for the new node. You can use letters a-z and numbers 0-9, no dashes, underscores, spaces or other characters.', newNodeId || newNodeIdDefault)
    // }
    // if (newNodeId === null) return
    // createNode(currentBoardId, newNodeId)
  }

  const createNode = async (boardId, name, body) => { 
    console.log('createNode', body)
    api(projectId, `/${boardId}/nodes/${name}`, { method: 'post', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
      })
      .catch(genericErrorHandler)
      .finally(() => { loadBoard(boardId) })
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
    saveNode(currentBoardId, editNodeId, editorContents)
  }

  const saveNode = (boardId, nodeId, body) => {
    api(projectId, `/${boardId}/nodes/${nodeId}`, { method: 'put', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        const node = board?.nodes?.find(_ => _.id === nodeId)
        if (node) {
          console.log('set modified false', node)
          node.modified = false
        }
      })
      .catch(genericErrorHandler)
      .finally(() => { loadBoard(boardId) })
  }

  onMount(async () => {
    loadBoardList();
  })

</script>

<div class="layout">
  <div class="ui">
    <button on:click={refresh}>refresh</button>
    <select bind:value={currentBoardId}>
      <option value={null}>(select)</option>
      {#each boards as boardId}
        <option value={boardId}>{boardId}</option>
      {/each}
    </select>
    <button on:click={createBoard}>create board</button>
    <button
      on:click={deleteCurrentBoard}
      disabled={!board}
      >
      delete board
    </button>
    <button
      on:click={createNodeInCurrentBoard}
      disabled={!board}
      >
      add node
    </button>
    <button
      on:click={deleteCurrentNode}
      disabled={!board || !editNodeId}
      >
      delete node
    </button>
    <button
      on:click={saveCurrentNode}
      disabled={!board || !editNodeId}
      >
      save node
    </button>
  </div>
  {#if board}
    <NodeGraph
      {projectId}
      boardId={currentBoardId}
      bind:board
      nodes={board.nodes}
      {userNodes}
      {previewUserId}
      on:boardchanged={() => { saveCurrentBoard(); updateUserNodes() }}
      bind:editNodeId
      bind:this={nodeGraph}
      />
  {:else}
    <div class="nodegraph"></div>
  {/if}
  {#if useCodeMirror}
    <CodeEditor bind:code={editorContents} />
  {:else}
    <textarea
      class="editor"
      bind:value={editorContents}
      disabled={editorContents === null}
      />
  {/if}
</div>

{#if showNewNodeModal}
  <NodeEditorNewNodeModal
    bind:templateText={newNodeContent}
    bind:nodeId={newNodeId}
    close={() => { showNewNodeModal = false }}
    submit={submitNewNodeModal}
    />
{/if}

<style>

.layout {
  display: grid;
  grid-template-rows: auto 70vh;
  grid-template-columns: 50% 50%;
  grid-template-areas:
    "ui   ui"
    "left right";
}

.ui {
  grid-area: ui;
}

.nodegraph,
.layout :global(.nodegraph) {
  grid-area: left;
  border: 1px solid #888;
  background: white;
  box-shadow: inset 0.2em 0.2em 0.2em rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
}

.editor {
  grid-area: right;
  display: block;
  width: 100%;
  height: 100%;
}

</style>
