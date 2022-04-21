<script>

  import { onMount, onDestroy } from 'svelte'

  import { InterkitClient } from 'interkit'

  import { Tabs, Tab, TabContent, Accordion, AccordionItem } from "carbon-components-svelte";

  import { boardsApi as api } from './BundleServer.js'

  import NodeGraph from './NodeGraph.svelte'
  import CodeEditor from './CodeEditor.svelte'
  import CodeEditorStringy from './CodeEditorStringy.svelte'
  import CodeEditorExporty from './CodeEditorExporty.svelte'
  import NodeEditorNewNodeModal from './NodeEditorNewNodeModal.svelte'

  const useCodeMirror = true
  let editorMode = 2

  import { cheatsheetContents } from './cheatsheet.js'

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
  $: currentBoardId, editNodeId, board, updateEditorContents()

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
        updateNodesModified()
      }
      node.contents = editorContents
      nodeGraph.updateConnections()
    }
    updateNodeMetadata()
  })()

  let nodesModifiedCount = 0
  let editNodeModified = false
  const updateNodesModified = () => {
    // I failed to do this idiomatically reactive
    nodesModifiedCount = board?.nodes?.filter(node => node.modified).length
    editNodeModified = board?.nodes?.find(node => node.id === editNodeId)?.modified
    _update++
  }
  $: editNodeId, updateNodesModified()

  const updateNodeMetadata = () => {
    board?.nodes?.forEach(node => {
      node._color = Math.random()
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

  const loadBoardList = async () => {
    await api(projectId, '/')
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

  const saveModifiedNodes = () => {
    board?.nodes
      .filter(node => node.modified)
      .forEach(node => saveNode(currentBoardId, node.id, node.contents))
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
          node.modified = false
          updateNodesModified()
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

  const moveTo = () => {
    console.log("moveTo", editNodeId, previewUserId, currentBoardId)
    InterkitClient.call("user.moveTo", {
      projectId,
      userId: previewUserId,
      boardId: currentBoardId,
      nodeId: editNodeId
    })
  }

  let syntaxCheckMessage = ''
  let syntaxCheckStatus = ''

  $: editorContents, () => { syntaxCheckMessage = ''; syntaxCheckStatus = '' }

  const syntaxCheck = () => {
    let code = editorContents
    // export are only allowed in modules
    code = code.replace(/^\s*export\b/gm, '/*xprt*/')
    try {
      eval(code)
      syntaxCheckStatus = 'ok'
      syntaxCheckMessage = 'no <i>syntactical</i> errors<br/><small>errors still might occur when the code runs</small>'
    } catch (err) {
      syntaxCheckStatus = 'bad'
      syntaxCheckMessage = `<b>${err.message}</b>`
      if (err.lineNumber) {
        syntaxCheckMessage += `<br/>at line <b>${err.lineNumber}</b>`
        if (err.columnNumber) syntaxCheckMessage += `, column <b>${err.columnNumber}</b>`
      }
      if (err.stack) {
        syntaxCheckMessage += `<pre>${err.stack}</pre>`
      }
    }
  }
 
  onMount(async () => {
    await loadBoardList();
    if (boards.length) currentBoardId = boards[0]
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
      on:click={saveModifiedNodes}
      disabled={!nodesModifiedCount}
      >
      save {nodesModifiedCount ? nodesModifiedCount : ''} nodes
      {#if nodesModifiedCount}&#x1f534;{/if}
    </button>
  </div>
  {#if board}
    <NodeGraph
      {projectId}
      boardId={currentBoardId}
      bind:board
      nodes={board.nodes}
      {_update}
      {userNodes}
      {previewUserId}
      on:boardchanged={() => { saveCurrentBoard(); updateUserNodes() }}
      bind:editNodeId
      bind:this={nodeGraph}
      />
  {:else}
    <div class="nodegraph"></div>
  {/if}
  <div>
    {#if editNodeId}
      <h3>
        {editNodeId}
        <button
          on:click={saveCurrentNode}
          disabled={!board || !editNodeId || !editNodeModified }
          >
          save
        </button>
        <button
          on:click={deleteCurrentNode}
          disabled={!board || !editNodeId}
          >
          delete
        </button>
        <button
          on:click={renameCurrentNode}
          disabled={!board || !editNodeId}
          >
          rename
        </button>
        <button on:click={moveTo}>moveTo</button>
        <button on:click={syntaxCheck}>quickCheck</button>
      </h3>
    {/if}
    <Tabs bind:selected={editorMode} autoWidth={true}>
      <Tab label="Strings" />
      <Tab label="Handlers" />
      <Tab label="Full" />
    </Tabs>
    <!-- can't use TabContent here, need if/else so only one of the editors is actually mounted at a time,
      otherwise two-way binds are a hot mess -->
        {#if editorMode === 0}
          <CodeEditorStringy bind:code={editorContents} class="editor" />
        {:else if editorMode === 1}
          <CodeEditorExporty
            code={editorContents}
            on:codechange={evt => { editorContents = evt.detail }}
            />
        {:else if editorMode === 2}
          {#if useCodeMirror}
            <CodeEditor
              code={editorContents}
              on:codechange={evt => { editorContents = evt.detail }}
              class="editor"
              />
          {:else}
            <textarea
              class="editor"
              bind:value={editorContents}
              disabled={editorContents === null}
              />
          {/if}
        {/if}
      {#if syntaxCheckMessage}
        <div class={`syntaxcheck syntaxcheck__status-${syntaxCheckStatus}`}>
          {@html syntaxCheckMessage}
        </div>
      {/if}
    <!--Accordion>
      <AccordionItem title="Cheatsheet"-->
        {#if useCodeMirror}
          <br>
          <p>Cheatsheet (click to activate)</p>
          <CodeEditor code={cheatsheetContents} readOnly={true} class="cheatsheet" />
        {:else}
          <textarea
            class="cheatsheet"
            value={cheatsheetContents}
            readonly="readonly"
            />
        {/if}
      <!--/AccordionItem>
    </Accordion-->
  </div>
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

</style>
