<script>
  import QrCode from "svelte-qrcode"
  import { Loading } from 'carbon-components-svelte'
  import { InterkitClient } from 'interkit'
  import { BundleServer, compileError, runtimeError, bundleProcessing, buildHash } from './BundleServer.js'
  import { onMount } from 'svelte'

  export let projectId, previewURL = ""

  let bundleServerURL

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
    BundleServer.init(projectId, bundleServerURL)
  })

  $: {
    previewURL = projectId ? bundleServerURL + "/app/" + projectId : null
  }

</script>

  <div class="frame">
    {#if bundleServerURL && !$compileError}
      {#key $buildHash}
        <iframe title="embedded app preview" src={previewURL}></iframe><br>
      {/key}
    {/if}
    {#if $bundleProcessing}
      <div class="loader">
        <Loading withOverlay={false}  />
      </div>
    {/if}
  </div>
  <button on:click={BundleServer.reloadPreview}>reload</button>
  <button on:click={BundleServer.compileReloadPreview}>compile & relaod</button>
  
  <br><br>
  
  <a target="_blank" href="{previewURL}">
      {#key previewURL}
        <QrCode value={previewURL} />
      {/key}
    <br>
    link to app
  </a>

{#if $compileError}
  <div class="error">compile error: {$compileError}</div>
{/if}

{#if $runtimeError}
  <div class="error">uncaught {$runtimeError}</div>
{/if}

<style>
  
  .frame {
    width: 100%;
    height: 400px;
    border: 1px solid lightgray;
    margin: 10px 0px 10px 0px;
    position: relative;
    box-shadow: 1px 1px 15px lightgray;
  }

  .loader {
    position: absolute;
    left:0; right:0; top:0; bottom:0;
    display: flex;
    align-items: center;
    place-content: center;
    background: #5555;
    backdrop-filter: blur(2px);
  }

  iframe {
    width: 100%;
    height: 100%;
  }
  .error {
    white-space: pre-wrap;
    font-family: courier;
  }
</style>