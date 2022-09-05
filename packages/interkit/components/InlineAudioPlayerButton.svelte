<script>

  import { InterkitClient, util } from '../'
  import { getContext } from 'svelte'

  import Icon from './Icon.svelte'

  export let audioColumn // specify a column to use for extracting the mediaFileKey from the buttonBar context
  export let audioKeyDirect // or just specify the key directly as a prop
  export let hideBackButton = false;

  const c = getContext('buttonBar')
  const buttonPayload = c?.buttonPayload 
  $: audioKey = audioKeyDirect || util.rowVal($buttonPayload, audioColumn)?.value

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

  const containerClick = function (e) {
    if (open) return
    e.stopPropagation()
    e.preventDefault()
    mainToggleClick()
  }

  const mainToggleClick = function () {
    open = true
    if (paused) {
      audioElement.play()
    } else {
      audioElement.pause()
    }
  }

  const skipBackClick = function () {
    currentTime = Math.max(0, currentTime - 30)
  }

  const closeClick = function () {
    open = false
    audioElement.pause()
    currentTime = 0
  }

  $: {
    loadAudiofile(audioKey)
  } 


</script>

{#key mediafile}
  {#if mediafile}
    <span
      class="container InlineAudioPlayerButton"
      class:open={open}
      on:click|capture={containerClick}
      >
        {#if mediafile}
          <audio controls="controls"
            bind:this={audioElement}
            bind:paused
            bind:currentTime
            bind:duration
            on:playing={() => { playing = true; loading = false }}
            >
            <source src={encodeURI(mediafile.link)} type="audio/mpeg">
          </audio>
          {#if !hideBackButton}
            <div class="button skip" on:click={skipBackClick} disabled="!(currentTime > 0)">
              <Icon type="skip-backward" />
            </div>
          {/if}
          <div class="button" on:click={mainToggleClick} disabled={loading}>
            <Icon type={ paused ? 'play' : 'pause' } />
          </div>
          <div class="time" style={`min-width: ${util.formatDuration(duration)?.length}ch`}>
            {util.formatDuration((open ? currentTime : duration) * 1000)}
          </div>
          <div class="button close" on:click={closeClick}>
            <Icon type="close" />
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
    height: 34px;
  }

  .container:not(.open) {
    cursor: pointer;
  }

  .container:not(.open) .skip,
  .container:not(.open) .close {
    visibility: hidden;
  }

  audio {
    display: none;
  }

  .button {
    padding: var(--distance-s);
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
  }

</style>
