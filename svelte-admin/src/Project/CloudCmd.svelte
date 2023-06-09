<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  
  export let projectId
  export let open = false
  
  let bundleServerURL

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
  })

</script>

<code>
local dev:  cd ../repositories/projects/{projectId}
<br />
dockerized: cd /var/repositories/projects/{projectId}
</code>

{#if open}
  <iframe src="{bundleServerURL}/fs/fs/{projectId}">
  </iframe>
{/if}

<style>
  iframe {
    width: 100%;
    height: 80vh;
  }
</style>