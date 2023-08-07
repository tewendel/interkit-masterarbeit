<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import { CopyButton } from "carbon-components-svelte";
  
  export let projectId
  export let open = false
  
  let bundleServerURL

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
  })

  const localCd = `cd ../repositories/projects/${projectId}`
  const dockerCd = `/var/repositories/projects/${projectId}`

</script>

<table>
  <tr>
    <td>local dev: {localCd}</td>
    <td><CopyButton text={localCd} /></td>
  </tr>
  <tr>
    <td>dockerized: {dockerCd}</td>
    <td><CopyButton text={dockerCd} /></td>
  </tr>
</table>

{#if open}
  <iframe src="{bundleServerURL}/fs/fs/{projectId}">
  </iframe>
{/if}

<style>
  td {
    vertical-align: middle;
    padding: 2px;
  }
  iframe {
    width: 100%;
    height: 80vh;
  }
</style>