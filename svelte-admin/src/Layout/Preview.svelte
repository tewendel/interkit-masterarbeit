<script>
  import QrCode from "svelte-qrcode"
  import { InterkitClient } from 'interkit'
  import Convert from 'ansi-to-html'
  import { BundleServer, compileError, runtimeError, bundleProcessing, bundleNotBuilt, buildHash } from '../BundleServer.js'
  import { tick, onMount } from 'svelte'
  import { currentProject, secondaryTabsPreviewSize, previewCurrentRoute, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'

  import { get } from 'svelte/store'

  import { 
    Tabs, 
    Tab, 
    TabContent, 
    Toggle,
    Button, 
    ButtonSet,
    Modal,
    Select,
    SelectItem,
    Loading,
    TooltipDefinition
  } from "carbon-components-svelte"

  import ChevronLeft from "carbon-icons-svelte/lib/ChevronLeft.svelte"
  import ChevronRight from "carbon-icons-svelte/lib/ChevronRight.svelte"
  import Rotate from "carbon-icons-svelte/lib/Rotate.svelte"
  import Renew from "carbon-icons-svelte/lib/Renew.svelte"
  import Settings from "carbon-icons-svelte/lib/Settings.svelte"
  import CopyLink from "carbon-icons-svelte/lib/CopyLink.svelte"
  import Reset from "carbon-icons-svelte/lib/Reset.svelte"
  import Save from "carbon-icons-svelte/lib/Save.svelte"
  import Launch from "carbon-icons-svelte/lib/Launch.svelte"

  export let projectId
  export let previewUserAuth;
  export let appVariant = "dev"
  
  const convert = new Convert();
  const query = new URLSearchParams(); // modify app configuration on request


  let previewURL = ""
  let buildURL = ""
  let bundlezipURL = "";
  let bundleServerURL
  let themed = true
  let localConfig = true
  let dummyData = false
  
  let iframeRef = null

  let showSettingsModal = false
  let showShareModal = false

  let iframeWidth, iframeHeight
  let containerWidth, containerHeight

  // <iframe bind:clientWidth> didn't work, or stopped working for some reason at some point
  const updateIframeSize = async () => {
    await tick()
    if (!iframeRef) return
    iframeWidth = iframeRef.clientWidth
    iframeHeight = iframeRef.clientHeight
  }
  $: containerWidth, containerHeight, iframeRef, size, updateIframeSize()

  let size
  const sizes = [
    { name: 'responsive', type: 'responsive' },
    { width: 390, height: 844, name: 'iPhone 14', type: 'absolute' },
    { width: 375, height: 667, name: 'iPhone SE', type: 'absolute' },
    { width: 320, height: 480, name: 'iPhone 4', type: 'absolute' },
    { width: 393, height: 851, name: 'Pixel 5', type: 'absolute' },
    { width: 1024, height: 768, name: 'iPad landsc.', type: 'absolute' },
    { width: 768, height: 1024, name: 'iPad portr.', type: 'absolute' },
    { width: 360, height: 640, name: 'generic 9:16', type: 'absolute' },
    { width: 360, height: 720, name: 'generic 1:2', type: 'absolute' },
  ]

  /* sync with style .preview-iframe! */
  const frameWidthX = 2 * 16
  const frameWidthY = 2 * 32

  let iframeStyle
  let scaleFactor
  $: {
    size = $secondaryTabsPreviewSize
    scaleFactor = Math.min(
      (containerWidth || 0) / (sizes[size].width + frameWidthX),
      ((containerHeight - 2 * 8) || 0) / (sizes[size].height + frameWidthY),
      //                  ^ padding
      1
    )
    /* any other transform-origin than top left is very complicated.
       calculation in scaled space, hence the scaleFactor multiplication and division */
    const translateX = Math.max(0, (containerWidth - (sizes[size].width + frameWidthX) * scaleFactor) / ( 2 * scaleFactor))
    iframeStyle = sizes[size].type === 'absolute'
      ? `width: ${sizes[size].width}px;
         height: ${sizes[size].height}px;
         transform: scale(${scaleFactor}) translateX(${translateX}px);
         box-sizing: content-box;`
      : 'width: 100%; height: 100%; box-sizing: border-box;'
  }

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
    query.set("dummyData", dummyData)
    if (localConfig && $currentProject) {
      query.set("localConfigURL", bundleServerURL + "/localConfig/" + $currentProject.slug)
    } else {
      query.delete("localConfigURL")
    }
    query.set("dev", true)
    //console.log("query", query.toString())
    if (bundleServerURL) {
      previewURL = projectId ? bundleServerURL + "/dev/" + projectId + "/" + "?" + query : null
      console.log('Layout/Preview', previewURL)
      buildURL = projectId ? bundleServerURL + "/app/" + projectId + "/" + "?" + query : null
      bundlezipURL = projectId ? bundleServerURL + "/bundlezip/" + projectId : null
    }
  }

  // send new previewUserId to preview when it is changed in admin
  $: {
    console.log("PreviewUserAuth update", previewUserAuth)
    if (iframeRef) {
      ifrMsgCmd({ command: 'set_userAuth', payload: previewUserAuth })
    }
  }

  const ifrMsgCmd = commandOrObj => {
    if (!iframeRef) {
      console.warn('ifrMsgCmd issued, but no iframeRef', iframeRef, commandOrObj)
      return
    }
    let postMessageOrigin = '*'
    if (document.location.port && false) {
      console.warn('assuming dev mode, allowing unsafe inter-frame communication')
    } else {
      if (!bundleServerURL) {
        console.warn('ifrMsgCmd issued, but no bundleServerURL', bundleServerURL, commandOrObj)
        return
      }
      postMessageOrigin = bundleServerURL.match(/^((?:https?:)?\/\/(.*?))(?:\/|$)/)
      if (!postMessageOrigin) {
        console.warn('ifrMsgCmd issued, but could not parse host from bundleServerURL', bundleServerURL, commandOrObj)
        return
      }
      postMessageOrigin = postMessageOrigin[1]
    }
    console.log('ifrMsgCmd issued can still fail if iframe hasn\'t loaded yet')
    console.log('ifrMsgCmd ', commandOrObj, postMessageOrigin, iframeRef?.contentWindow)
    try {
      if (typeof commandOrObj === 'string') {
        iframeRef.contentWindow.postMessage({ command: commandOrObj }, postMessageOrigin) 
      } else {
        iframeRef.contentWindow.postMessage(commandOrObj, postMessageOrigin) 
      }
    } catch (err) {
      console.warn(`Inter-frame communication with the preview failed. Check your script blockers and see docs: Basics/Interface Overview, Troubleshooting`, commandOrObj, err)
    }
  }

  previewOverrideStyleTokens.subscribe(value => {
    ifrMsgCmd({
      command: 'set_overrideStyleTokens',
      payload: value
    })
  })

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

<div style="display: flex; align-items: center">
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
      icon={Renew}
      on:click={() => reload(false)}
      iconDescription="Reload (Preview)"
      tooltipAlignment="start"
      tooltipPosition="top"
      />
  </ButtonSet>
  <input
    value={$previewCurrentRoute}
    style="flex-grow: 1"
    class="currentRoute"
    readonly
    title={$previewCurrentRoute}
    />
  <div style="text-align: center; margin-left: 1em; margin-right: 1em">
    <TooltipDefinition
      tooltipText="Size of the preview window in device pixels"
      >
      {iframeWidth}×{iframeHeight}px
    </TooltipDefinition>
    {#if scaleFactor < 1.0}
      <TooltipDefinition
        tooltipText="Scale factor to fit the preview"
        >
        @{Math.round(scaleFactor * 100)}%
      </TooltipDefinition>
    {/if}
  </div>
  <Select inline size="sm" bind:selected={$secondaryTabsPreviewSize} style="flex-grow: 0">
    {#each sizes as _, idx}
      <SelectItem value={idx} text={_.name} />
    {/each}
  </Select>
</div>
<div class="preview-container"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  >
  {#if bundleServerURL && !$compileError}
    {#key $buildHash + $currentProject?.id + String($currentProject?.uiState?.viteServer?.status !== "running") }
      <iframe 
        on:error={(e) => console.log("iframe error", e)}
        class="preview-iframe"
        style={iframeStyle}
        title="embedded app preview" 
        src={ appVariant == "dev" ? previewURL : buildURL }
        allow="camera;microphone;geolocation;autoplay;accelerometer"
        bind:this={iframeRef}
        data-build-hash={$buildHash}>
      </iframe>
    {/key}
  {/if}
  {#if $bundleProcessing || ($currentProject && $currentProject?.uiState?.viteServer?.status !== "running")}
    <div class="loader">
      <Loading withOverlay={false} />
    </div>
  {/if}
</div>

<ButtonSet style="justify-content: flex-end">
  {#if $currentProject && $currentProject?.uiState?.lastBuildDate}
    <div class="lastBuildDate">
      {#key $currentProject.uiState.lastBuildDate}
        Last Published:<br/>
        {new Date($currentProject.uiState.lastBuildDate).toLocaleString()}
      {/key}
    </div>
  {/if}
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
    tooltipAlignment="end"
    />
  <Button
    kind="ghost"
    size="small"
    icon={Reset}
    on:click={() => reload(true)}
    iconDescription="Reset"
    tooltipPosition="top"
    tooltipAlignment="end"
    />
  {#if appVariant == "dev"}
    <Button
      kind="tertiary"
      size="small"
      on:click={() => build()}
      disabled={$bundleProcessing || $currentProjectReadOnly}
      icon={Save}
      >
      Publish
    </Button>
  {/if}
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
    <Toggle
      size="sm"
      labelText="Dummy Data"
      bind:toggled={dummyData}
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
            <!-- svelte-ignore security-anchor-rel-noreferrer -->
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

<style lang="scss">

  @use '@carbon/type';

  ._workaround_ { /* vite sometimes strips the very first rule when HMR */ }
  
  .preview-container {
    /* ...- .pane-controls - top ButtonSet - bottom ButtonSet - bottom padding */
    height: calc(var(--content-height) - 48px - 40px - 32px - 8px);
    overflow: hidden;
    padding: 8px 0;
  }

  .preview-iframe {
    transform-origin: top left;
    border-color: lightgray; 
    border-style: solid;
    /* sync with frameWidthX/Y! */
    border-width: 32px 16px;
    border-radius: 24px;
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

  .error {
    white-space: pre-wrap;
    font-family: courier;
    background-color: #333;
    color: #f0f0f0;
    padding: 1ex;
    overflow: scroll;
  }

  .lastBuildDate {
    text-align: left;
    @include type.type-style('helper-text-01');
    margin-right: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .currentRoute {
    cursor: default;
    border: 0;
    background: transparent;
  }

</style>
