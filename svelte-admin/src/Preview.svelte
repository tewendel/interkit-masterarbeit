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
    ButtonSet,
    Modal,
    AspectRatio,
    Select,
    SelectItem,
    Loading,
    TooltipDefinition
  } from "carbon-components-svelte"

  import ChevronLeft from "carbon-icons-svelte/lib/ChevronLeft.svelte"
  import ChevronRight from "carbon-icons-svelte/lib/ChevronRight.svelte"
  import Rotate from "carbon-icons-svelte/lib/Rotate.svelte"
  import Settings from "carbon-icons-svelte/lib/Settings.svelte"
  import CopyLink from "carbon-icons-svelte/lib/CopyLink.svelte"
  import Reset from "carbon-icons-svelte/lib/Reset.svelte"
  import Save from "carbon-icons-svelte/lib/Save.svelte"
  import Launch from "carbon-icons-svelte/lib/Launch.svelte"

  export let projectId, previewURL = "", buildURL = "", previewUserAuth;
  export let currentProject;

  const convert = new Convert();
  const query = new URLSearchParams(); // modify app configuration on request

  let bundlezipURL = "";
  let bundleServerURL
  let themed = true
  let localConfig = true
  let iframeRef = null

  $: window.__ifr = iframeRef

  let showSettingsModal = false
  let showShareModal = false

  let w, h

  const aspectRatios = '3x4 9x16 1x2 1x1 4x3'.split(' ')

  let aspectRatio = aspectRatios[0]

  onMount(async () => {
    bundleServerURL = BundleServer.getServerURL()
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
    BundleServer.initProject(projectId)
  })

  $: {
    //console.log(themed)
    query.set("loadTheme", themed)
    //query.set("projectId", projectId)
    //console.log("currentProject", $currentProject)
    //console.log("localConfig", localConfig)
    if(localConfig) {
      query.set("localConfigURL", bundleServerURL + "/localConfig/" + $currentProject.slug)
    } else {
      query.delete("localConfigURL")
    }
    query.set("dev", true)
    //console.log("query", query.toString())
    previewURL = projectId ? bundleServerURL + "/dev/" + projectId + "/" + "?" + query : null
    buildURL = projectId ? bundleServerURL + "/app/" + projectId + "/" + "?" + query : null
    bundlezipURL = projectId ? bundleServerURL + "/bundlezip/" + projectId : null
  }

  // send new previewUserId to preview when it is changed in admin
  $: {
    console.log("PreviewUserAuth update", previewUserAuth)
    if (iframeRef) {
      ifrMsgCmd({ command: 'set_userAuth', payload: previewUserAuth })
    }
  }

  const ifrMsgCmd = commandOrObj => {
    if (typeof commandOrObj === 'string') {
      iframeRef.contentWindow.postMessage({ command: commandOrObj }, '*') 
    } else {
      iframeRef.contentWindow.postMessage(commandOrObj, '*') 
    }
  }

  const reload = withReset => {
    if (withReset) {
      ifrMsgCmd('clear_localStorage')
      setTimeout(BundleServer.reloadPreview, 100)
    } else {
      BundleServer.reloadPreview()
    }
  }

  const build = () => {
    BundleServer.compileReloadPreview()
  }

</script>

<div style="display: flex; justify-content: space-between">
  <ButtonSet>
    <!-- Back/forward buttons do not work in the current state.
      See interkit/components/AppBase for more info.
    <Button
      kind="ghost"
      size="small"
      icon={ChevronLeft}
      on:click={() => ifrMsgCmd('go_back')}
      iconDescription="Back (Preview History)"
      />
    <Button
      kind="ghost"
      size="small"
      icon={ChevronRight}
      on:click={() => ifrMsgCmd('go_forward')}
      iconDescription="Forward (Preview History)"
      />
    -->
    <Button
      kind="ghost"
      size="small"
      icon={Rotate}
      on:click={() => reload(false)}
      iconDescription="Reload (Preview)"
      tooltipAlignment="start"
      tooltipPosition="top"
      />
  </ButtonSet>
  <div style="align-self: center">
    <TooltipDefinition
      tooltipText="size of the preview window in device pixels"
      >
      {w}×{h}px
    </TooltipDefinition>
  </div>
  <Select inline bind:selected={aspectRatio} style="flex-grow: 0">
    {#each aspectRatios as _}
      <SelectItem value={_} text={_.replace('x', ':')} />
    {/each}
  </Select>
</div>
<div class="frame" bind:clientWidth={w} bind:clientHeight={h}>
  <AspectRatio ratio={aspectRatio}>
    {#if bundleServerURL && !$compileError}
      {#key $buildHash}
        <iframe 
          title="embedded app preview" 
          src={previewURL} 
          allow="camera;microphone;geolocation;autoplay;accelerometer"
          bind:this={iframeRef}
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

<ButtonSet style="justify-content: flex-end">
  <Button
    kind="ghost"
    size="small"
    icon={Settings}
    on:click={() => { showSettingsModal = true }}
    iconDescription="Settings…"
    tooltipPosition="top"
    />
  <Button
    kind="ghost"
    size="small"
    icon={CopyLink}
    on:click={() => { showShareModal = true }}
    iconDescription="Share…"
    tooltipPosition="top"
    />
  <Button
    kind="ghost"
    size="small"
    icon={Reset}
    on:click={() => reload(true)}
    iconDescription="Reset"
    tooltipPosition="top"
    />
  <Button
    kind="tertiary"
    size="small"
    on:click={() => build()}
    disabled={$bundleProcessing}
    icon={Save}
    >
    Build
  </Button>
</ButtonSet>

<Modal
  bind:open={showSettingsModal}
  modalHeading="Settings"
  passiveModal
  >
  <!-- the margin prevents a stray vertical scrollbar -->
  <div style="display: flex; margin-bottom: 1px">
    <Toggle
      size="sm"
      labelText="Apply Theme"
      toggled on:toggle={(e) => themed = e.detail.toggled}
      />
    <Toggle
      size="sm"
      labelText="Local Config"
      toggled
      on:toggle={(e) => localConfig = e.detail.toggled}
      />
  </div>
</Modal>

<Modal
  bind:open={showShareModal}
  modalHeading="Share…"
  passiveModal
  >
  {#if $bundleNotBuilt}
    <p>Please save/build first TODO</p>
  {:else}
    <Tabs>
      <Tab label="Web preview" />
      <Tab label="App preview" />
      <div slot="content">
        <TabContent>
          <div>
            <a
              target="_blank"
              title={buildURL}
              href={buildURL}
              style="text-decoration: none"
              >
              {#key buildURL}
                <QrCode
                  value={buildURL}
                  padding={15}
                  />
              {/key}
              <br/>
              <Launch style="vertical-align: middle" />
              <u>Link to app</u>
            </a>
          </div>
        </TabContent>
        <TabContent>
          <div>
            <a
              download
              title={bundlezipURL}
              href={bundlezipURL}
              style="text-decoration: none"
              >
              {#key bundlezipURL}
                <QrCode
                  value={bundlezipURL}
                  padding={15}
                  />
              {/key}
              <br>
              <Launch style="vertical-align: middle" />
              <u>Download bundle ZIP</u>
            </a>
          </div>
        </TabContent>
      </div>
    </Tabs>  
  {/if}
</Modal>
  
{#if $compileError}
  <div class="error">compile error: {@html convert.toHtml($compileError)}</div>
{/if}

{#if $runtimeError}
  <div class="error">{$runtimeError} (check browser console for details)</div>
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
