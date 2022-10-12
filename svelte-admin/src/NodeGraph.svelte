<script>

  import { onMount } from 'svelte'
  import { writable, get } from 'svelte/store'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { boardsApi as api } from './BundleServer.js'
  import { idRE } from 'interkit/project-boards-nodes.js'

  // N.B. this also finds invalid code
  const parseREmoveTo = new RegExp(`moveTo\\s*\\(\\s*["'](${idRE})["']`, 'gu')

  export let projectId
  export let boardId
  export let nodes = []
  export let editNodeId
  export let board
  export let userNodes
  export let _update
  export let rectWidth
  export let rectHeight

  // this hack forces a redraw, reacting to any node content modifications
  $: nodes._update = _update

  let svgEl
  let mouseX
  let mouseY
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
    let unmetMoveTos
    nodes.forEach(fromNode => {
      // if (!fromNode.contents) return
      const fromX = fromNode.posX + rectWidth / 2
      const fromY = fromNode.posY + rectHeight / 2
      if (!fromNode.contents || (typeof fromNode.contents !== 'string')) {
        console.log('NodeGraph updateConnections fromNode has no contents, bailing', fromNode)
        return
      }
      const moveTos = [...fromNode.contents.matchAll(parseREmoveTo)].map(_ => _[1])
      moveTos.forEach(toNodeId => {
        const toNode = nodes.find(_ => _.id === toNodeId)
        if (!toNode) {
          unmetMoveTos = unmetMoveTos || {}
          unmetMoveTos[fromNode.id] = unmetMoveTos[fromNode.id] || []
          unmetMoveTos[fromNode.id].push(toNodeId)
          // console.log('#unmet', fromNode, toNodeId)
        } else {
          const toX = toNode.posX + rectWidth / 2
          const toY = toNode.posY + rectHeight / 2
          connections.push({ fromX, fromY, toX, toY })
        }
      })
    })
    return {
      unmetMoveTos
    }
  }

  $: nodes, updateConnections()

  const localStore = name => {
    let initialValue
    const key = `interkit-admin-node-boardview-${projectId}-${boardId}-${name}`
    try {
      initialValue = JSON.parse(localStorage.getItem(key))
    } catch (e) {
      initialValue = undefined
    }
    console.log('localStore initial', key, initialValue)
    const store = writable(initialValue)
    store.subscribe(newValue => {
      localStorage.setItem(key, JSON.stringify(newValue))
    })
    return store
  }

  let nodeDragStartX
  let nodeDragStartY
  let nodeDragOrigX
  let nodeDragOrigY

  let offsetX
  let offsetY
  let zoom

  const getBoardView = () => {
    offsetX = localStore('offsetX')
    if (typeof get(offsetX) !== 'number') offsetX.set(0.0)
    offsetY = localStore('offsetY')
    if (typeof get(offsetY) !== 'number') offsetY.set(0.0)
    zoom = localStore('zoom')
    if (typeof get(zoom) !== 'number') zoom.set(1.0)
    console.log('getBoardView', {
      projectId,
      boardId,
      offsetX: get(offsetX),
      offsetY: get(offsetY),
      zoom: get(zoom)
    })
  }

  getBoardView()
  $: projectId, boardId, getBoardView()

  const doZoom = dir => {
    zoom.set(Math.max(get(zoom) + zoomStep * dir, minZoom))
  }

  const resetCanvas = () => {
    zoom.set(1.0)
    offsetX.set(0.0)
    offsetY.set(0.0)
  }

  const nodeMetaStyle = node => `fill: ${node?.contents?.match(/\/\/ *color *: *(#?\w+)/)?.[1]};`
  const nodeMetaExcerpt = node => node?.contents?.match(/\/\/ *info *: *(.*)/)?.[1] || ''
  const nodeMetaExcerptFontsize = node => Math.max(10, 32 - 2 * (nodeMetaExcerpt(node)?.length || 0)) + 'px'
  
  const mouseup = () => {
    if (dragging !== false) {
      dispatch('nodemoved', { targetNode: nodes[dragging] })
      dragging = false
    }
    if (canvasDragging) {
      canvasDragging = false;
    }
  }

  const mousemove = e => {
    // update dragging node
    const r = svgEl.getClientRects()
    if (!(r && r.length)) return
    mouseX = e.clientX - r[0].x
    mouseY = e.clientY - r[0].y
    if (dragging !== false) {
      /* nodeDragOrigX = original coord of node in "board pixels" (not viewport pixels)
       *   (board pixels start at board origin and obey zoom)
       * nodeDragStartX = coord where the drag started, in board pixels
       * mouseX = current drag coord, in viewport pixels
       * get(offsetX) = current board offset, in viewport pixels
       * … / get(zoom) = apply zoom, from viewport to board pixels
       */
      const nodeDragCurrentX = (mouseX - get(offsetX)) / get(zoom)
      const nodeDragCurrentY = (mouseY - get(offsetY)) / get(zoom)
      nodes[dragging].posX = nodeDragOrigX + nodeDragCurrentX - nodeDragStartX
      nodes[dragging].posY = nodeDragOrigY + nodeDragCurrentY - nodeDragStartY
    } else {
      if (canvasDragging) {
        mouseX = e.clientX
        mouseY = e.clientY
        offsetX.set(mouseX - canvasDragStartX)
        offsetY.set(mouseY - canvasDragStartY)
      }
    }
  }

  onMount(() => {
    document.addEventListener('mouseup', () => mouseup(), { passive: true })
    document.addEventListener('mousemove', evt => mousemove(evt), { passive: true })
  })

</script>

<div class="scale-controls">
  <button on:click={() => { doZoom(-1) }}>-</button>
  <button on:click={() => { resetCanvas() }}>0</button>
  <button on:click={() => { doZoom(1) }}>+</button>
</div>

<svg
  bind:this={svgEl}
  class="nodegraph"
  on:mousedown={(e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    canvasDragging = true
    canvasDragStartX = mouseX - get(offsetX)
    canvasDragStartY = mouseY - get(offsetY)
    e.preventDefault() // to prevent text selection
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

  <g transform="translate({$offsetX},{$offsetY}) scale({$zoom},{$zoom})">

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
          nodeDragStartX = (mouseX - get(offsetX)) / get(zoom)
          nodeDragStartY = (mouseY - get(offsetY)) / get(zoom)
          nodeDragOrigX = node.posX
          nodeDragOrigY = node.posY
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
          <foreignObject 
            x={node.posX + 5}
            y={node.posY + 5}
            width={rectWidth - 10}
            height={rectHeight - 10}
            class="script-node" 
          >
          <div xmlns="http://www.w3.org/1999/xhtml"><!--
          -->{node.id}{#if node.modified}*{/if}
          </div>
          </foreignObject>
          
        
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
        style={
          'transform: translate(' +
          (userNode.atNode.posX + userNode.rndSeed[0] * (rectWidth - 20) + 10) +
          'px,' +
          (userNode.atNode.posY + userNode.rndSeed[1] * (rectHeight - 35) + 30) +
          'px)'
        }
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
  user-select: none;
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
