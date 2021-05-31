<script>
  import QrCode from "svelte-qrcode"
  import { InterkitClient } from 'interkit'
  import Convert from 'ansi-to-html'
  import { BundleServer, compileError, runtimeError, bundleProcessing, bundleNotBuilt, buildHash } from './BundleServer.js'
  import { onMount } from 'svelte'
  import { 
    Tabs, 
    Tab, 
    TabContent, 
    Toggle,
    Button, 
    AspectRatio,
    Dropdown,
    Grid,
    Row,
    Column,
    Loading } from "carbon-components-svelte";
  import ReloadIcon from "carbon-icons-svelte/lib/Play20";
  import ReloadCompileIcon from "carbon-icons-svelte/lib/SkipForward20";

  export let projectId, previewURL = "";
  export let currentProject;

  const convert = new Convert();
  const query = new URLSearchParams(); // modify app configuration on request

  let bundlezipURL = "";
  let bundleServerURL
  let themed = true
  let localConfig = true

  let w, h

  const dropdown_AR_items = [
    { id: "4x3" },  
    { id: "1x1" },
    { id: "3x4" },
    { id: "9x16" },
  ];
  let dropdown_AR_selectedIndex = 2;

  onMount( async () => {
    bundleServerURL = BundleServer.getServerURL()
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
    BundleServer.initProject(projectId)
  })

  $: {
    //console.log(themed)
    query.set("loadTheme", themed)
    //query.set("projectId", projectId)
    //console.log("currentProject", $currentProject)
    console.log("localConfig", localConfig)
    if(localConfig) {
      query.set("localConfigURL", bundleServerURL + "/localConfig/" + $currentProject.slug)
    } else {
      query.delete("localConfigURL")
    }
    query.set("dev", true)
    console.log("query", query.toString())
    previewURL = projectId ? bundleServerURL + "/app/" + projectId + "/" + "?" + query : null
    bundlezipURL = projectId ? bundleServerURL + "/bundlezip/" + projectId : null
  }

</script>

  
  <div class="frame" bind:clientWidth={w} bind:clientHeight={h}>
    <AspectRatio ratio={dropdown_AR_items[dropdown_AR_selectedIndex].id}>
      {#if bundleServerURL && !$compileError}
        {#key $buildHash}
          <iframe 
            title="embedded app preview" 
            src={previewURL} 
            allow="geolocation"
            data-build-hash={$buildHash}>
          </iframe><br>
        {/key}
      {/if}
      {#if $bundleProcessing}
        <div class="loader">
          <Loading withOverlay={false}  />
        </div>
      {/if}
    </AspectRatio>
  </div>

  <Button icon={ReloadIcon} on:click={BundleServer.reloadPreview}>reload</Button>
  
  <br><br>
  <Grid>
    <Row>
      <Column>
        <Toggle size="sm" labelText="Apply Theme" toggled on:toggle={(e) => themed = e.detail.toggled}/>
      </Column>
      <Column>
        <Toggle size="sm" labelText="Local Config" toggled on:toggle={(e) => localConfig = e.detail.toggled}/>
      </Column>
      <Column>
        Frame: {w} x {h} px
        <Dropdown
          type="inline"
          titleText="Aspect Ratio"
          bind:selectedIndex={dropdown_AR_selectedIndex}
          items={dropdown_AR_items}
        />
      </Column>
    </Row>
  </Grid>

  <br>

  {#if $bundleNotBuilt}
    <Button on:click={()=>BundleServer.compileReloadPreview()}>Build Preview</Button>
  {:else}
    {#if $bundleProcessing}
      <Loading withOverlay={false} small />
    {:else}
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
    {/if}
  {/if}
  
{#if $compileError}
  <div class="error">compile error: {@html convert.toHtml($compileError)}</div>
{/if}

{#if $runtimeError}
  <div class="error">uncaught {$runtimeError}</div>
{/if}

<style>
  
  .frame {
    width: 100%;
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
    background-color: #333;
    color: #f0f0f0;
    padding: 1ex;
    overflow: scroll;
  }
</style>