<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"

  const projectDataStore = InterkitClient.userProjectDataStore

</script>

<div class="UserDebugger frame">
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