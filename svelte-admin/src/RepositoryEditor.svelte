<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import {BundleServer} from './BundleServer'

  export let projectId
  export let open = false
  
  let commitInfo = "?"
  let bundleServerURL

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    BundleServer.connect(bundleServerURL)
  })

  async function updateCommitInfo() {
    const status = await BundleServer.gitStatus(projectId)
    console.log(status)
    if (status.commit) {
      commitInfo = `${status.commit.sha} (${status.commit.message})`
    }
  }

  $: {
    if (projectId && open) {
      updateCommitInfo()
    }
  }

</script>

<code>
local dev:  cd ../repositories/projects/{projectId}
<br />
dockerized: cd /var/repositories/projects/{projectId}
</code>

{#if open}
  <p>
  commit: <b>{ commitInfo }</b>
  </p>
  <iframe src="{bundleServerURL}/fs/fs/{projectId}">
  </iframe>
{/if}

<style>
  iframe {
    width: 100%;
    height: 80vh;
  }

  p {
    margin: 1ex 0;
  }
</style>