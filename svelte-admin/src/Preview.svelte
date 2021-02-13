<script>
  import InterkitClient from '../../shared/interkit-client.js'
  import BundleServer from './BundleServer.js'
  import { onMount } from 'svelte'

  export let projectId

  let bundleServerURL
  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
    BundleServer.init(projectId, bundleServerURL)
  })

  $: previewURL = projectId ? bundleServerURL + "/app/" + projectId : null

</script>

<button on:click={BundleServer.compileReloadPreview}>compile & relaod</button><br>
{#if bundleServerURL}
  <iframe id="app-preview" src={previewURL}></iframe><br>
{/if}
<a target="_blank" href="{previewURL}">link to app</a>


