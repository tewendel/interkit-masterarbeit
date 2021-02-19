<script>
  import { InterkitClient } from 'interkit-shared'
  import { BundleServer, compileError, runtimeError } from './BundleServer.js'
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

{#if bundleServerURL && !$compileError}
  <iframe id="app-preview" src={previewURL}></iframe><br>
  <button on:click={BundleServer.reloadPreview}>reload</button>
  <button on:click={BundleServer.compileReloadPreview}>compile & relaod</button>
  <a target="_blank" href="{previewURL}">link to app</a><br><br>
{/if}

{#if $compileError}
  <div class="error">compile error: {$compileError}</div>
{/if}

{#if $runtimeError}
  <div class="error">uncaught {$runtimeError}</div>
{/if}

<style>
  iframe {
    width: 100%;
    border: 1px solid lightgray;
    margin: 10px 0px 10px 0px;
  }
  .error {
    white-space: pre-wrap;
    font-family: courier;
  }
</style>