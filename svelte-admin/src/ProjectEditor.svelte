<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import { 
      Button,
    } from "carbon-components-svelte";

  export let projectId

</script>

<h3>Info</h3>
<p>
  Project ID: {projectId}
</p>

<Button href={`${INTERKIT_SERVER_URL}export/?projectId=${projectId}`}>Export current Database & Media</Button>

<h3>Snapshots (coming soon)</h3>

<style>
</style>