<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"

  const projectDataStore = InterkitClient.userProjectDataStore

  let userId = InterkitClient.userId
  let projectId = InterkitClient.projectId

  export let teleportTargetNodes = ''
  let teleportTargetNodesArr = []

  $: teleportTargetNodesArr = teleportTargetNodes.split(';') 
    .map(_ => {
      const [boardId, nodeId] = _.split('_')
      return { boardId, nodeId }
    })
    .filter(_ => _.boardId && _.nodeId)

  const setUserVar = (varName, value) => {
    InterkitClient.call('user.setUserVar', {
      userId: get(userId),
      varName,
      value
    })
  }

</script>

<div class="UserDebugger frame">
  <h2>Info</h2>
  <dl>
    <dt>userId</dt>
    <dd>{$userId}</dd>
  </dl>
  <dl>
    <dt>projectId</dt>
    <dd>{$projectId}</dd>
  </dl>
  <h2>Variables</h2>
  <dl>
    <dt>turboMode</dt>
    <dd>
      <code>{$projectDataStore?.userVars?.debugTurboMode || '…'}</code>
      {#if $userId}
        <button on:click={() => setUserVar('debugTurboMode', true)}>enable</button>
        <button on:click={() => setUserVar('debugTurboMode', false)}>disable</button>
      {/if}
    </dd>
  </dl>
  <h2>Chat/Nodes</h2>
  {#if !$userId || !$projectId}
    <div>no userId or projectId, teleport not available</div>
  {:else}
    <div>Teleport/&quot;moveTo&quot; to:<br/>
      {#each teleportTargetNodesArr as targetNode}
        <button on:click={() => InterkitClient.usersMoveTo({
                userIds: [$userId],
                projectId: $projectId,
                boardId: targetNode.boardId,
                nodeId: targetNode.nodeId
          })}>
          {targetNode.boardId} _ {targetNode.nodeId}
        </button>
      {/each}
    </div>
  {/if}
  <h2>Debug info</h2>
  <pre>
    {JSON.stringify($projectDataStore, null, 2)}
  </pre>
</div>


<style>
  .frame {
  }

  h2 {
    font-weight: 120%;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
  }

  button {
    border: 1px solid black;
    background: #ddd;
    padding: 0.25em;
    border-radius: 3px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  }

  pre {
    white-space: pre;
    overflow-x: auto;
    overflow-y: visible;
    width: 100%;
  }

  dl {
    display: flex;
    margin: 0.5em 0;
    flex-basis: 50%;
    font-family: monospace;
  }

  dt {
    font-weight: bold;
    flex-basis: 50%;
  }

  dd {
    flex-basis: 50%;
  }

</style>
