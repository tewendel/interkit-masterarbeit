<script foo>
  // import { token } from './stores.js';  
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { boardsApi as api } from './BundleServer.js'

  import { onMount } from 'svelte'

  // N.B. this also finds invalid code
  const parseREmoveTo = /moveTo\s*\(\s*["']([a-z0-9]+)["']/g

  export let projectId
  export let boardId
  
  export let nodes = [];
  export let setEditNodeId;
  export let editNodeId;

  export let playerNodeId;
  export let currentBoardData;

  const saveNode = async (node) => {
    const body = {
      code: node.code,
      posX: node.posX,
      posY: node.posY
    }
    api(
      projectId,
      `/${boardId}/nodes/${node.id}`,
      {
        method: 'put',
        body: JSON.stringify(body)
      }
    )
  }

  const getNodeById = id => nodes.find(n => n.id === id)
  const getNodeIndexById = id => nodes.findIndex(n => n.id === id)

  const saveCanvasOffset = async (x, y)=> {
    return // TODO
    await fetch("/api/board/" + currentBoardData.id, {
          method: 'PUT',
          headers: {
            // 'authorization': $token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({offsetX: x, offsetY: y})
        })    
  }

  const saveCanvasZoom = async (z)=> {
    return // TODO
    await fetch("/api/board/" + currentBoardData.id, {
          method: 'PUT',
          headers: {
            // 'authorization': $token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({zoom: z})
        })    
  }


  export const updateConnections = () => {
    connections = []
    nodes.forEach(fromNode => {
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

  let mouseX;
  let mouseY;
  let offsetX;
  let offsetY;
  let rectWidth = 100;
  let rectHeight = 70;
  let dragging = false
  let dragStart;

  let canvasDragging = false;
  let canvasDragStartX = 0;
  let canvasDragStartY = 0;
  let zoomStep = 0.1;
  let canvasOffsetX;
  let canvasOffsetY;
  let zoom;
  
  $: {
    canvasOffsetX = currentBoardData.offsetX ? currentBoardData.offsetX : 0;
    canvasOffsetY = currentBoardData.offsetY ? currentBoardData.offsetY : 0;
    zoom = currentBoardData.zoom ? currentBoardData.zoom : 1;
  }
  
  let connections = [];
  
</script>

  <div class="scale-controls">
    <button on:click={()=>{zoom -= zoomStep; saveCanvasZoom(zoom);}}>-</button>
    <button on:click={()=>{zoom += zoomStep; saveCanvasZoom(zoom);}}>+</button>
  </div>

 <svg
  class="nodegraph"
  on:mousedown={()=>{
    canvasDragging = true;
    canvasDragStartX = mouseX - canvasOffsetX;
    canvasDragStartY = mouseY - canvasOffsetY;
  }}
  on:mousemove={(e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;         
    // update dragging node
    if (dragging !== false) {
      nodes[dragging].posX = mouseX - offsetX;
      nodes[dragging].posY = mouseY - offsetY;  
    } else {
      if(canvasDragging) {
        canvasOffsetX = mouseX - canvasDragStartX;
        canvasOffsetY = mouseY - canvasDragStartY;
      }
    }
  }}
  on:mouseup={()=>{
    if (dragging !== false) {
     console.log('dispatching boardchanged')
      dispatch('boardchanged', { targetNode: nodes[dragging] })
      dragging = false
    }

    if(canvasDragging) {
      canvasDragging = false;
      saveCanvasOffset(canvasOffsetX, canvasOffsetY);
    }
  }}
 >

  <g transform="translate({canvasOffsetX},{canvasOffsetY}) scale({zoom},{zoom})">
  
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
          refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" />
    </marker>
  </defs>
      
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
        on:mousedown|stopPropagation={(e)=>{
            console.log("mousedown", node.id);
            dragging = index // getNodeIndexById(node.id);
            dragStart = Date.now();
            offsetX = mouseX - node.posX;
            offsetY = mouseY - node.posY;
          }}
        on:click={()=>{
          if(Date.now() - dragStart < 250) {
            editNodeId = node.id
          }
          }}
      >
        <rect
          x={node.posX}
          y={node.posY}
          width={rectWidth}
          height={rectHeight}
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
          y={node.posY+35}
        >
          {#if editNodeId == node.id}editing{/if}
        </text>
        <text 
          class="script-node-attribute"
          x={node.posX+10}
          y={node.posY+48}
        >
        </text>
        <text 
          class="script-node-attribute"
          x={node.posX+10}
          y={node.posY+61}
        >
          {#if currentBoardData.startingNode == node.id}starting node{/if}
        </text>

      </g>

      />
  {/each}  
  
  </g>
</svg>


<style>

line,
polyline {
  stroke: black;
  stroke-width: 1;
}

svg {
  position: relative;
}

svg:hover {
  cursor: grab;
}

rect {
    fill: #efe9d0;
    stroke:black;
    stroke-width:1;
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

.playerCounter {
  fill: gray;
  font-size: 10px;
}

</style>
