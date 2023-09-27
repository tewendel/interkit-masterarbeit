<script>

  import { getContext, onMount, onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'
  import Button from "./Button.svelte"
  import Icon from './Icon.svelte';
  import MediaFileResolver from './MediaFileResolver.svelte';
  import Overlay from './Overlay.svelte';
  import Loading from './Loading.svelte'
  import Player from "@vimeo/player";
  
  import { util } from '../'

  export let videoColumn
  export let vimeoColumn
  export let mediafileKey
  export let vimeoUrl
  
  export let controls = "none" // interkit | native | none
  export let loop = false
  export let buttonOptions

  let vimeoElem = null;
  let vimeoPlayer = null;
  let vimeoOptions;
  const initVimeoOptions = (url) => {
    if(url) {
      vimeoOptions = {
        url,
        responsive: true,
        controls: false,
        title: false,
      }
      console.log("setting up vimeo options", vimeoOptions)
    }    
  }
  if(vimeoUrl) initVimeoOptions(vimeoUrl)

  const elementContext = getContext("element")
  console.log("elementContext video", $elementContext)
  if(!elementContext && !mediafileKey && !vimeoUrl) {
    console.warn("VideoButton needs either an element context, for example from DataLoaderSingle, or a static mediafileKey or a static vimeoUrl")
  }

  $: {
    if(vimeoColumn) initVimeoOptions(util.rowVal($elementContext, vimeoColumn))  
  }
  let videoFileRef;
  $: {
    if(mediafileKey) videoFileRef = {value: mediafileKey}
    if(videoColumn) videoFileRef = util.rowVal($elementContext, videoColumn)
    //console.log("videoFileRef", videoFileRef)
  }
  
  let playerOpen = false
  let showControls = true
  let rangeSliderValue
  let rangeSliderDragging
  let videoPlayerDuration
  let videoPlayerCurrentTime = 0
  let videoPlayerLoading
  let videoPlayerPaused

  const openPlayer = () => {
    playerOpen = true
    showControls = true
    videoPlayerCurrentTime = 0
  }
  const closePlayer = () => playerOpen = false
  
  const format = (seconds) => {
    if (isNaN(seconds)) return '...';
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;
    return `${minutes}:${seconds}`;
  }

  // hide controls automatically
  let hideControlsTimeout
  const resetControlsTimeout = () => {
    console.log("resetControlsTimeout")
    if(hideControlsTimeout) clearTimeout(hideControlsTimeout)
    hideControlsTimeout = setTimeout(()=>{
      if(!videoPlayerPaused)
        showControls = false;
    }, 10000)
  }
  onMount(()=>{
    resetControlsTimeout()
  })

  const initVimeo = () => {
    setTimeout(()=>{
      vimeoPlayer = new Player(vimeoElem, vimeoOptions);
      vimeoPlayer.on("timeupdate", function (arg) {
        videoPlayerCurrentTime = arg.seconds;
      });
      vimeoPlayer.on("loaded", function (arg) {
        vimeoPlayer
          .getDuration()
          .then(function (d) {
            videoPlayerDuration = d;
          })
          .catch(function (error) {
            console.log("vimeo error", error)
            // an error occurred
          });
      });
      vimeoPlayer.on("ended", function () {
        videoPlayerPaused = true;
        videoPlayerCurrentTime = 0;
        vimeoPlayer.setCurrentTime(0);
      });
      //vimeoPlayer.play() // deactivated, prevents play on iOS, because not directly connected to button press
      videoPlayerPaused = true
    }, 50)
  }

  $: {
    if(playerOpen && vimeoOptions) {
      initVimeo();
    }
  }

  onDestroy(()=>{
    clearTimeout(hideControlsTimeout)
  })

  const setTimeDom = (seconds) => {
    console.log(seconds)
    if(seconds < 0) seconds = 0
    if(seconds > videoPlayerDuration) seconds = videoPlayerDuration
    console.log(seconds)
    if(vimeoPlayer) {
      vimeoPlayer.setCurrentTime(seconds)
    } else {  
      // currentTime binding is buggy in svelte, using dom is more reliable
      // see https://svelte.dev/repl/3470317362744bf296ae78b688445448?version=3.9.2
		  let element = document.getElementById('videoButtonVideoId')
      element.currentTime = seconds
    }
    videoPlayerCurrentTime = seconds
	}
  
  const toggleControls = () => {
    if(controls == "interkit")
      showControls = !showControls
    if(showControls) resetControlsTimeout();
  }
  
  const seek = (seconds) => {
    setTimeDom(videoPlayerCurrentTime + seconds)
    resetControlsTimeout()
  }
  const seekTo = (seconds) => {
    setTimeDom(seconds)
    resetControlsTimeout()
  }
  const togglePlay = () => {    
    if(vimeoPlayer) {
      if(videoPlayerPaused) {
        vimeoPlayer.play()
      } else {
        vimeoPlayer.pause()
      }
    }
    videoPlayerPaused = !videoPlayerPaused;
    videoPlayerCurrentTime = videoPlayerCurrentTime == videoPlayerDuration ? 0 : videoPlayerCurrentTime
    resetControlsTimeout()
  }
  const updateSliderValue = (value) => {
    if(!rangeSliderDragging) {
      rangeSliderValue = value
    }
  }
  $: updateSliderValue(videoPlayerCurrentTime)

</script>

{#if playerOpen}

  <Overlay classes="VideoPlayer" customStyle="background-color: #000;">

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="container">

      {#if vimeoOptions}
        <div class="vimeo" 
          bind:this={vimeoElem}
        ></div>
      {:else}
        
        <!-- svelte-ignore a11y-media-has-caption -->
        <video 
          id="videoButtonVideoId"
          autoplay 
          controls={controls == "native"} 
          {loop} 
          bind:currentTime={videoPlayerCurrentTime}
          bind:duration={videoPlayerDuration}
          bind:paused={videoPlayerPaused}
        >
          <MediaFileResolver let:url mediafileRef={videoFileRef} >
            <source src={url} >
          </MediaFileResolver>
        </video>

      {/if}

      <div class="click-catcher" on:click={toggleControls}></div>

      <div class="VideoPlayer__Close close">
        <Button size="small" type="secondary" on:click={closePlayer}>
          <Icon type="Full-Close"/>
        </Button>
      </div>

    </div>

    {#if controls == "interkit" && showControls}

    <div class="expanded-bottom-bar VideoPlayer__BottomBar" out:fly|local={{ y: 200, duration: 500 }}>

      <div class="expanded-range-slider VideoPlayer__Range expanded">
        <input 
          type="range" 
          class="seekPositionRangeSlider VideoPlayer__Range__Input" 
          name="seekPosition"
          min="0" 
          step="0.05"
          max={videoPlayerDuration} 
          bind:value={rangeSliderValue}
          on:input={()=>{rangeSliderDragging = true;}}
          on:change={()=>{
            seekTo(rangeSliderValue)
            rangeSliderDragging = false;
          }}
        >
      </div>

      <div class="expanded-time VideoPlayer__Time expanded">
        <span class="currentTime">{format(videoPlayerCurrentTime)}</span>
        <span class="duration">{format(videoPlayerDuration)}</span> 
      </div>

      <div class="expanded-controls VideoPlayer__Controls">

        <div class="center-controls VideoPlayer__CenterControls">

          <div class="VideoPlayer__PlayButton seekbutton">
            <Button dummyNoText size="small" type="link" on:click={()=>{seek(-30)}}>
              <Icon type="Thin-Replay-30" />
            </Button>
          </div>

          <div class="VideoPlayer__PlayButton playbutton">
            {#if videoPlayerLoading }
              <Loading inverse/>
            {:else}
              <Button dummyNoText size="large" type="primary" on:click={togglePlay}>
                <Icon inverse type={ videoPlayerPaused ? "Full-Play" : "Full-Pause"} />
              </Button>
            {/if}
          </div>

          <div class="VideoPlayer__PlayButton seekbutton">
            <Button dummyNoText size="small" type="link" on:click={()=>{seek(15)}}>
              <Icon type={"Thin-Forward-15"} />
            </Button>
          </div>

        </div>
        
      </div>

    </div>      

    {/if}

  </Overlay>

{:else}

  <Button {buttonOptions} on:click={openPlayer} mainClass="VideoButton">
      <slot name="Icon"/>
  </Button>

{/if}

<style>

  .container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .close {
    position: absolute;
    top: var(--distance-s);
    left: var(--distance-s);
  }

  video {
    width: 100%;
    height: 100%;
  }

  .vimeo {
    flex: 1;
  }

  .click-catcher {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .expanded-bottom-bar {
    background-color: var(--color-background-highlight);
    padding: 16px 8px;
    box-sizing: border-box; 
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .expanded-controls, .expanded-range-slider, .expanded-time {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 4px 8px 0 8px;
  }

  .expanded-controls .center-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 25px;
    flex: 1;
  }

  .expanded-time {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .expanded-time span {
    font: var(--font-caption);
    letter-spacing: var(--letter-spacing-caption);
  }

  :not(.expanded) .base-content .seekbutton {
    display: none;
  }
  
  .seekPositionRangeSlider {
    width: 100%;
    -webkit-appearance: none;
    background-color: var(--color-border-button-primary);
    height: 1px;
    margin: 0;
    /* this is to have a larger target to tap */
    /* border-top: 10px solid #000; 
    border-bottom: 10px solid #000; */
  }

  .seekPositionRangeSlider::-moz-range-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    background: var(--color-border-button-primary);
    margin-top: -5px;
    border-radius: 50%;
    border: none;
  }
  
  .seekPositionRangeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    background: var(--color-border-button-primary);
    border-radius: 50%;
    border: none;
  }

</style>
