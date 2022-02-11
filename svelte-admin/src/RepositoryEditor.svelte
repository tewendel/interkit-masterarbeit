<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import {BundleServer} from './BundleServer'

  export let projectId
  export let open = false
  
  let commitInfo = "?"
  let bundleServerURL

  let selectedTab

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

{#if open}
  <p>
  commit: <b>{ commitInfo }</b>
  </p>
{/if}

<style>
  p {
    margin: 1ex 0;
  }
</style>


