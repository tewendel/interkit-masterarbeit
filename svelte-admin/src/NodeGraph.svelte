<script>

  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { boardsApi as api } from './BundleServer.js'
  import { idRE } from 'interkit/project-boards-nodes.js'

  // N.B. this also finds invalid code
  const parseREmoveTo = new RegExp(`moveTo\\s*\\(\\s*["'](${idRE})["']`, 'gu')

  export let nodes = []
  export let editNodeId
  export let board
  export let userNodes
  export let _update

  // this hack forces a redraw, reacting to any node content modifications
  $: nodes._update = _update

  const rectWidth = 100
  const rectHeight = 70

  let mouseX
  let mouseY
  let offsetX
  let offsetY
  let dragging = false
  let dragStart
  let canvasDragging = false
  let canvasDragStartX = 0
  let canvasDragStartY = 0
  const zoomStep = 0.1
  const minZoom = 0.1

  let connections = []

  const getNodeById = id => nodes.find(n => n.id === id)
  const getNodeIndexById = id => nodes.findIndex(n => n.id === id)

  export const updateConnections = () => {
    connections = []
    nodes.forEach(fromNode => {
      // if (!fromNode.contents) return
      const fromX = fromNode.posX + rectWidth / 2
      const fromY = fromNode.posY + rectHeight / 2
      const moveTos = [...fromNode.contents.matchAll(parseREmoveTo)].map(_ => _[1])
      moveTos.forEach(toNodeId => {
        const toNode = nodes.find(_ => _.id === toNodeId)
        if (!toNode) return
        const toX = toNode.posX + rectWidth / 2
        const toY = toNode.posY + rectHeight / 2
        connections.push({ fromX, fromY, toX, toY })
      })
    })
  }

  $: nodes, updateConnections()

  const zoom = dir => {
    board.zoom = Math.max(board.zoom + zoomStep * dir, minZoom)
    dispatch('boardchanged')
  }

  const resetCanvas = () => {
    board.zoom = 1.0
    board.offsetX = 0
    board.offsetY = 0
    dispatch('boardchanged')
  }

  const nodeMetaStyle = node => `fill: ${node?.contents?.match(/\/\/ *color *: *(#?\w+)/)?.[1]};`
  const nodeMetaExcerpt = node => node?.contents?.match(/\/\/ *info *: *(.*)/)?.[1] || ''
  const nodeMetaExcerptFontsize = node => Math.max(10, 32 - 2 * (nodeMetaExcerpt(node)?.length || 0)) + 'px'

</script>

<div class="scale-controls">
  <button on:click={() => { zoom(-1) }}>-</button>
  <button on:click={() => { resetCanvas() }}>0</button>
  <button on:click={() => { zoom(1) }}>+</button>
</div>

<svg
  class="nodegraph"
  on:mousedown={() => {
    canvasDragging = true
    canvasDragStartX = mouseX - board.offsetX
    canvasDragStartY = mouseY - board.offsetY
  }}
  on:mousemove={(e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    // update dragging node
    if (dragging !== false) {
      // FIXME dragging is off when zoom != 1.0
      nodes[dragging].posX = mouseX - offsetX
      nodes[dragging].posY = mouseY - offsetY
    } else {
      if (canvasDragging) {
        board.offsetX = mouseX - canvasDragStartX
        board.offsetY = mouseY - canvasDragStartY
      }
    }
  }}
  on:mouseup={() => {
    if (dragging !== false) {
      dispatch('boardchanged', { targetNode: nodes[dragging] })
      dragging = false
    }
    if (canvasDragging) {
      dispatch('boardchanged')
      canvasDragging = false;
    }
  }}
  >

  <defs>
    <marker
      id="arrowhead" markerWidth="10" markerHeight="7"
      refX="0" refY="3.5" orient="auto"
      >
      <polygon points="0 0, 10 3.5, 0 7" />
    </marker>
    <marker
      id="dot" markerWidth="10" markerHeight="10"
      refX="5" refY="5" orient="auto"
      >
      <circle r="5" cx="5" cy="5" />
    </marker>
  </defs>

  <g transform="translate({board.offsetX},{board.offsetY}) scale({board.zoom},{board.zoom})">

    {#each connections as c}
      <polyline
        marker-mid="url(#arrowhead)"
        marker-end="url(#arrowhead)"
        points={`${c.fromX},${c.fromY}
          ${(c.fromX+c.toX)/2},${(c.fromY+c.toY)/2}
          ${c.toX},${c.toY}`}
        />
    {/each}

    {#each nodes as node, index}
      <g
        class={`node ${node.id === board.startId ? 'node--start' : ''}`}
        on:mousedown|stopPropagation={(e) => {
          console.log("mousedown", node.id)
          dragging = index
          dragStart = Date.now()
          offsetX = mouseX - node.posX
          offsetY = mouseY - node.posY
        }}
        on:click={() => {
          if (Date.now() - dragStart < 250) {
            editNodeId = node.id
          }
        }}
        >
        {#if node.id === board.startId}
          <polyline
            marker-start="url(#dot)"
            marker-mid="url(#arrowhead)"
            marker-end="url(#arrowhead)"
            points={`${node.posX-rectWidth*0.5},${node.posY-rectWidth*0.5}
              ${node.posX-rectWidth*0.25},${node.posY-rectWidth*0.25}
              ${node.posX+rectWidth*0.5},${node.posY+rectWidth*0.5}`}
            />
        {/if}
        <rect
          x={node.posX}
          y={node.posY}
          width={rectWidth}
          height={rectHeight}
          class="node"
          class:node__editing={editNodeId === node.id}
          class:node__modified={node.modified}
          style={nodeMetaStyle(node)}
          />
        <text
          class="script-node"
          x={node.posX+10}
          y={node.posY+20}
          >
          {node.id}
          {#if node.modified}*{/if}
        </text>
        <text
          class="script-node-attribute"
          x={node.posX+10}
          y={node.posY+55}
          style={`font-size: ${nodeMetaExcerptFontsize(node)}`}
          >
          {nodeMetaExcerpt(node)}
        </text>
        <text
          class="script-node-attribute"
          x={node.posX+10}
          y={node.posY+61}
          >
          {#if board.startingNode == node.id}starting node{/if}
        </text>
      </g>
    {/each}

    {#each userNodes as userNode}
      {#if userNode.atNode}
      <g
        class="usernode"
        style={`transform: translate(${userNode.atNode.posX + userNode.rndSeed[0] * (rectWidth - 10)}px,${userNode.atNode.posY + userNode.rndSeed[1] * (rectHeight - 10)}px)`}
        >
        <circle
          cx="0" cy="0"
          r={userNode.isPreviewUser ? 5 : 3}
          fill={userNode.isPreviewUser ? 'darkblue' : 'black'}
          stroke={userNode.isPreviewUser ? 'black' : '0'}
          opacity={userNode.isPreviewUser ? 1 : 0.2}
          />
        <text x="6" y="10">{userNode.id}</text>
      </g>
      {/if}
    {/each}
  </g>
</svg>

<style>

svg {
  position: relative;
}

svg:hover {
  cursor: grab;
}

rect {
  fill: #efe9d0;
  stroke: black;
  stroke-width: 1;
}

polyline {
  stroke: black;
  stroke-width: 1;
}

.node__editing {
  filter: drop-shadow(0.3em 0.3em black);
}

.node__modified {
  filter: drop-shadow(0.3em 0.3em red);
}

.node__editing.node__modified {
  filter: drop-shadow(0.3em 0.3em black) drop-shadow(0.3em 0.3em red);
}

g.usernode {
  transition: transform 1s;
}

g.usernode text {
  display: none;
}

g.usernode:hover text {
  display: block;
}

.script-node {
  fill: black;
  user-select: none;
  z-index: 1;
}

.script-node-attribute {
  fill: gray;
  font-size: 10px;
  user-select: none;
  z-index: 1;
}

g:hover {
  cursor: pointer;
}

.scale-controls {
  position: absolute;
  bottom: 0;
  z-index: 100;
}

.scale-controls button {
  width: 1.5em;
}

</style>
