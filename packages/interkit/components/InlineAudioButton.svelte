<script>

  import { InterkitClient, util } from '..'
  import { getContext } from 'svelte'

  import { getShowDummyDataStore, dummyAudioSrc } from './dummyDataHelpers.js'

  import Icon from './Icon.svelte'

  export let audioColumn // specify a column to use for extracting the mediaFileKey from the buttonBar context
  export let audioKeyDirect // or just specify the key directly as a prop, used by Chat
  export let hideSkipControls = true; hideSkipControls = util.blocklyBool(hideSkipControls);
  
  export let autoplay = false

  export let buttonOptions

  export let playbackControl = "stopped"; // use to start/stop playback through prop

  const showDummyData = getShowDummyDataStore()
  
  const elementContext = getContext("element")
  if(!elementContext && !audioKeyDirect) {
    console.warn("InlineAudioButton needs an element context, for example from DataList")
  }
  
  $: audioKey = audioKeyDirect || util.rowVal($elementContext, audioColumn)?.value

  let audioElement
  let mediafile
  let open = false
  let playing = false
  let paused = true
  let loading = true
  let currentTime = 0
  let duration = 0

  const loadAudiofile = async (key) => {
    loading = true
    if (key) {
      mediafile = await InterkitClient.getMediaFile(key)
    } else {
      mediafile = null;
    }
    loading = false
  }

  const mainToggleClick = function () {
    console.log("mainToggleClick", playbackControl)
    switch(playbackControl) {
      case "stopped":
        playbackControl = "playing"
        break;
      case "paused":
        playbackControl = "playing"
        break;
      case "playing": 
        playbackControl = "paused"
        break;
    }
  }

  const updatePlayerState = () => {
    if(!audioElement) return;
    if(playbackControl == "paused") {
      open = true
      audioElement.pause();
    } 
    if(playbackControl == "playing") {
      open = true;
      audioElement.play();
    }
    if(playbackControl == "stopped") {
      open = false
      audioElement.pause();
      currentTime = 0
    }
  }

  const containerClick = function (e) {
    if (open) return
    e.stopPropagation()
    e.preventDefault()
    mainToggleClick()
  }

  $: if(playbackControl) updatePlayerState()

  // this is not reliable on firefox - svelte bug, should work on chrome/webkit https://github.com/sveltejs/svelte/issues/3524
  const skipBackClick = async function () {
    currentTime = Math.max(0, currentTime - 30)
  }

  const skipForwardClick = async function () {
    currentTime = Math.min(duration, currentTime + 15)
  }

  const closeClick = function () {
    playbackControl = "stopped"
  }

  $: {
    loadAudiofile(audioKey)
  } 


</script>

{#key mediafile}
  {#if mediafile || $showDummyData}
    <span
      class="container InlineAudioButton"
      class:open={open}
      on:click|capture={containerClick}
      >
        {#if mediafile || $showDummyData}
          <audio
            class="InlineAudioButton__Audio"
            controls="controls"
            {autoplay}
            bind:this={audioElement}
            bind:currentTime
            bind:paused
            bind:duration
            on:playing={() => { playing = true; loading = false }}
            >
            <source src={$showDummyData ? dummyAudioSrc : encodeURI(mediafile.link)} type="audio/mpeg">
          </audio>
          {#if !hideSkipControls}
            <div
              class="button skip InlineAudioButton__Back"
              on:click={skipBackClick}
              disabled="!(currentTime > 0)"
              >
              <Icon type="Thin-Replay-30" />
            </div>
          {/if}
          <div class="button InlineAudioButton__Play" on:click={mainToggleClick} disabled={loading}>
            {#if autoplay}<abbr title="autoplay"><small>A</small></abbr>{/if}
            <Icon type={ paused ? 'Thin-Play' : 'Thin-Pause' } />
          </div>
          <div class="time InlineAudioButton__Time" style={`min-width: ${util.formatDuration(duration)?.length}ch`}>
            {util.formatDuration((open ? currentTime : duration) * 1000)}
          </div>
          {#if !hideSkipControls}
            <div
              class="button skip InlineAudioButton__Forward"
              on:click={skipForwardClick}
              disabled="!(currentTime > 0)"
              >
              <Icon type="Thin-Forward-15" />
            </div>
          {/if}
          <div class="button close InlineAudioButton__Close" on:click={closeClick}>
            <Icon type="Full-Close" />
          </div>
        {:else}
          <Icon type="error" />
          no mediafile
        {/if}
      
    </span>
  {/if}
{/key}

<style>

  .container { /* imitate Button */
    border: var(--border-width) solid var(--border-color);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    box-shadow: var(--box-shadow);
    display: inline-flex;
    overflow: hidden;
    align-items: center;
    min-height: 32px;
  }

  .container:not(.open) {
    cursor: pointer;
  }

  .container:not(.open) .skip,
  .container:not(.open) .close {
    display: none;
  }

  audio {
    display: none;
  }

  .button {
    padding: calc(var(--inset) * 0.5rem);
    cursor: pointer;
    display: inline-flex;
  }

  :global(.ButtonPanel) .button {
    padding-top: var(--distance-s);
    padding-bottom: var(--distance-s);
  }

  .time {
    text-align: center;
    min-width: 3.5em;
    min-width: 5ch; /* at least 5 zeros (rounding up the colon) */
    font-variant-numeric: tabular-nums; /* reduce jitter */
    padding: var(--distance-s);
  }

</style>
