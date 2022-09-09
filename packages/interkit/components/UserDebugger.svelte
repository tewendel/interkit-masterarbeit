<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"

  const projectDataStore = InterkitClient.userProjectDataStore

  let userId = InterkitClient.userId

  const setUserVar = (varName, value) => {
    InterkitClient.call('user.setUserVar', {
      userId: get(userId),
      varName,
      value
    })
  }

</script>

<div class="UserDebugger frame">
  <dl>
    <dt>userId</dt>
    <dd>{$userId}</dd>
    <dt>turboMode</dt>
    <dd>
      <code>{$projectDataStore?.userVars?.debugTurboMode || '…'}</code>
      {#if $userId}
        <button on:click={() => setUserVar('debugTurboMode', true)}>enable</button>
        <button on:click={() => setUserVar('debugTurboMode', true)}>disable</button>
      {/if}
    </dd>
  </dl>
  <pre>
    {JSON.stringify($projectDataStore, null, 2)}
  </pre>
</div>


<style>
  .frame {
  }

  pre {
    white-space: pre;
    overflow-x: auto;
    overflow-y: visible;
    width: 100%;
  }
</style>
