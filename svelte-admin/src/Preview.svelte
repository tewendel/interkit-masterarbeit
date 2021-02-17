<script>
  import InterkitClient from '../../shared/interkit-client.js'
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

<!--button on:click={BundleServer.compileReloadPreview}>compile & relaod</button><br-->
{#if bundleServerURL && !$compileError}
  <iframe id="app-preview" src={previewURL}></iframe><br>
  <a target="_blank" href="{previewURL}">link to app</a><br><br>
{/if}

{#if $compileError}
  <div class="error">compile error: {$compileError}</div>
{/if}

{#if $runtimeError}
  <div class="error">uncaught runtime error: {$runtimeError}</div>
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