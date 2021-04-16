<script>
  import QrCode from "svelte-qrcode"
  import { InterkitClient } from 'interkit'
  import { BundleServer, compileError, runtimeError, bundleProcessing, buildHash } from './BundleServer.js'
  import { onMount } from 'svelte'
  import { 
    Tabs, 
    Tab, 
    TabContent, 
    Toggle,
    Button, 
    Loading } from "carbon-components-svelte";
  import ReloadIcon from "carbon-icons-svelte/lib/Play20";
  import ReloadCompileIcon from "carbon-icons-svelte/lib/SkipForward20";

  export let projectId, previewURL = "";

  const query = new URLSearchParams(); // modify app configuration on request

  let bundlezipURL = "";
  let bundleServerURL
  let themed = true

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
    BundleServer.init(projectId, bundleServerURL)
  })

  $: {
    console.log(themed)
    query.set("loadTheme", themed)
    query.set("projectId", projectId)
    previewURL = projectId ? bundleServerURL + "/app/" + projectId + "/" + "?" + query : null
    bundlezipURL = projectId ? bundleServerURL + "/bundlezip/" + projectId : null
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
  <Button icon={ReloadIcon} on:click={BundleServer.reloadPreview}>reload</Button>
  
  <Button icon={ReloadCompileIcon} kind="tertiary" on:click={BundleServer.compileReloadPreview}>compile & relaod</Button>

  <br><br>
  <Toggle size="sm" labelText="Apply Theme" toggled on:toggle={(e) => themed = e.detail.toggled}/>

  <br><br>

  <Tabs>
      <Tab label="web preview" />
      <Tab label="app preview" />
    <div slot="content">
      <TabContent>
        <div>
          <a target="_blank" href="{previewURL}">
              {#key previewURL}
                <QrCode value={previewURL} />
              {/key}
            <br>
            link to app
          </a>
        </div>          
      </TabContent>
      <TabContent>
        <div>
          <a target="_blank" href="{bundlezipURL}">
              {#key bundlezipURL}
                <QrCode value={bundlezipURL} />
              {/key}
            <br>
            bundle zip
          </a>
        </div>
          
      </TabContent>
      
    </div>
  </Tabs>
  
  
  
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