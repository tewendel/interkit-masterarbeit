<script>

  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { onMount } from 'svelte'
  import NodeGraph from './NodeGraph.svelte'
  import { boardsApi as api } from './BundleServer.js'
  import CodeEditor from './CodeEditor.svelte'

  const useCodeMirror = true

  // TODO this could be centralized somewhere.
  // theoretically, usefully between admin AND bundler,
  // e.g. to be used in server.mjs for validation
  const boardIdRE = /^[a-z0-9]+$/
  const nodeIdRE = boardIdRE

  export let projectId

  /*
  const api = function (resource, init) {
    console.info('api', resource, init)
    // return fetch(resouce, init)
    return new Promise((resolve, reject) => {
      if (resource === '/api/scriptNode' && init.method === 'POST') {
        resolve({
          json: function () {
            return []
          }
        })
      }
      resolve({
        json: function () {
          return []
        }
      })
    })
  }
  */

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

  let editNodeId = null;

  const setEditNodeId = async (nodeId)=>{
    console.log("setEditNodeId", nodeId)
    if(nodeId) {
      // XXX
      const res = await api(projectId, "/api/scriptNode/" + nodeId);
      const json = await res.json();
      console.log("loaded node", json)
      
      if(!currentBoardData || currentBoardData._id != json.board) {
        currentBoardId = json.board;  
        loadBoardData()
      }
    }
    
    editNodeId = nodeId
  };

  let playerNodeId = null;
  const updatePlayerNodeId = (nodeId)=>{
    console.log("updatePlayerNodeId", nodeId);
    playerNodeId = nodeId
  }
  let currentBoardIdSelect = null;
  const setCurrentBoardId = (boardId)=>{
    console.log("setCurrentBoardId"); 
    currentBoardId = boardId;
    currentBoardIdSelect = currentBoardId;
  };
  let currentBoardData = null;
  const setCurrentBoardData = (boardData)=>{
    currentBoardData = boardData;
  }
  const reloadBoardData = ()=>{
    //if(currentBoardData) currentBoardData.expired = true;
    loadBoardData();
  }
  let playerId;
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
    board.nodes.forEach(node => {
      if (isNaN(node.posX)) node.posX = 10
      if (isNaN(node.posY)) node.posY = 10
      if (typeof node.id !== 'string')
        node.id = 'node_' + Math.random().toString(36).substr(2)
      // TODO connections
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

  /*
  const checkBoardSelect = ()=> {
    if($boardCodeChanged) {
      currentBoardIdSelect = currentBoardId
      alert("unsaved code changes")
      return;
    }
    // get value from select element
    currentBoardId = currentBoardIdSelect;
    loadBoardData();
  }
  */
  const loadBoardData = async ()=>{
    
    if(currentBoardId == "new") {
      createBoard();
      return;
    }
    console.log("reloading board data", currentBoardId);
    editMode = false;
    tabNavigation = "boards";
    if(currentBoardId) {
      // XXX
      const res = await api("/api/board/" + currentBoardId + "?$embed=scriptNodes");
      const json = await res.json();
      setCurrentBoardData(json);
      currentBoardIdSelect = currentBoardId;
      if(!json.startingNode) {
        alert("warning: no starting node set");
      }
    } else {
      setCurrentBoardData(null);
    }
  }
  const createBoard = () => {
    /*
    let newBoard = {
      new: true,
      key: "",
      name: "",
      scriptNodes: [],
      library: "",
      // project: project._id,
      listed: true
    }
    */
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
        currentBoardId = json.result.name
        await loadBoard(currentBoardId)
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
  const closeBoard = ()=>{
    setCurrentBoardData(null);  
    setEditNodeId(null);
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
    console.log('saveBoard', boardId, body)
    body = JSON.stringify(body)
    api(projectId, '/' + boardId, { method: 'put', body })
      .then(async res => {
        const json = await res.json()
        errorify(json)
        // loadBoard(boardId)
      })
      .catch(genericErrorHandler)
  }

  const createNodeInCurrentBoard = () => {
    let c = 0
    let newNodeId
    let newNodeIdDefault
    while (!newNodeIdDefault || (board.nodes.findIndex(node => node.id === newNodeIdDefault) > -1 && c < 1000)) {
      c++
      newNodeIdDefault = 'node' + c
    }
    while (newNodeId === undefined || !nodeIdRE.test(newNodeId)) {
      newNodeId = window.prompt('Please enter an ID for the new node. You can use letters a-z and numbers 0-9, no dashes, underscores, spaces or other characters.', newNodeId || newNodeIdDefault)
    }
    if (newNodeId === null) return
    createNode(currentBoardId, newNodeId)
  }

  // this is here because new nodes can be created from board and from editor
  const createNode = async (boardId, name) => { 
    api(projectId, `/${boardId}/nodes/${name}`, { method: 'post' })
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

  /* XXX
  const createNode = async (name, boardId)=>{
    let newNode = {
      name: name,
      board: boardId,
      script: `function onArrive() {\n\n}\n\nfunction onReceive (input) {\n\n}`,
      multiPlayer: false,
      posX: 100,
      posY: 100
    }
    let response = await api("/api/scriptNode", {
      method: "POST",
      headers: {
        // 'authorization': $token,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify(newNode)
    });
    if (response.ok) {
      let json = await response.json();
      console.log(json);
      return json._id;
    }
  }
  */

  onMount(async () => {
    //playerId = await findOrCreatePlayer();
    //await initSocket(playerId);
    //console.log("playerId set for project workspace", playerId);
    loadBoardList();
    // createBoard()
  })

</script>

<div class="layout">
  <!--
  <Tabs type="container">
    <Tab label="a1" />
    <Tab label="a2" />
    <div slot="content">
      <TabContent>aaaaa1</TabContent>
      <TabContent>bbbbbb2</TabContent>
    </div>
  </Tabs>
  -->
  <div class="ui">
    <button on:click={refresh}>refresh</button>
    <select bind:value={currentBoardId}>
      <option value={null}>(select)</option>
      {#each boards as boardId}
        <option value={boardId}>{boardId}</option>
      {/each}
    </select>
    <button on:click={createBoard}>create board</button>
    <button on:click={deleteCurrentBoard}>delete board</button>
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
      currentBoardData={board}
      nodes={board.nodes}
      on:boardchanged={saveCurrentBoard}
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
