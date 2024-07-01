<script context="module">
  /*
  // moved to InterkitClient
  import { get } from "svelte/store"
  
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")
  
  export const playAudio = async (elementRow, audioColumn, autoplay=true) => {

    if(elementRow) {
      if(elementRow.key == get(audioPlayerElement)?.key) {
        // if this element is already in player, just toggle paused state
        audioPlayerStatus.update( s => ({
          ...s, 
          paused: !get(audioPlayerStatus)?.paused,
          currentTime: s?.currentTime == s?.duration ? 0 : s.currentTime
        })) 
      } else {
        // new element, reset
        audioPlayerElement.set(elementRow)
        audioPlayerStatus.set({
          active: true,
          //elementRow,
          autoplay,
          paused: false,
          currentTime: 0,
          expanded: false,
          loading: true,
          audioKey: util.rowVal(elementRow, audioColumn)?.value
        })  
      }
    }
  }*/

  export const format = (seconds) => {
    if (isNaN(seconds)) return '...';

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
  }

</script>

<script>
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  import { onMount, setContext } from 'svelte'
  import { InterkitClient, util } from '../'
  import Icon from './Icon.svelte'
  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Overlay from "./Overlay.svelte";
  
  // import all the column information
  export let titleColumn = "elements/title"
  export let audioColumn = "elements/audio"
  
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")
  setContext("element", audioPlayerElement)

  let title
  $: title = util.rowVal($audioPlayerElement, titleColumn)
  
  const closePlayer = () => {
    audioPlayerStatus.set({active: false})
    audioPlayerElement.set(null);
  }

  const togglePlay = () => {    
    audioPlayerStatus.update( s => ({
      ...s, 
      paused: !$audioPlayerStatus.paused,
      currentTime: s.currentTime == s.duration ? 0 : s.currentTime
    }))
  }

  let playerExpanded = false;
  const toggleExpanded = () => {
    playerExpanded = !playerExpanded;
    audioPlayerStatus.update( s => ({
      ...s, expanded: playerExpanded
    }))
  }
  
  // mark elements as "listend to" after 10s of playback
  const markElementListened = (time) => {
    if(time > 20) {
      let key = $audioPlayerElement?.key
      if(key && !InterkitClient.getElementProperty(key, "checked")) {
        InterkitClient.setElementProperty(key, "checked", true)  
      }      
    }
  }
  $: {
    markElementListened($audioPlayerStatus?.currentTime) 
  }

  //let rangeSliderValue = $audioPlayerStatus?.currentTime
  let rangeSliderValue = 0;
  let rangeSliderDragging = false;

  const updateSliderValue = (value) => {
    if(!rangeSliderDragging) {
      rangeSliderValue = value
    }
  }

  $: updateSliderValue($audioPlayerStatus?.currentTime)

  const seek = (seconds) => {
    audioPlayerStatus.set({
      ...$audioPlayerStatus,
      currentTime: $audioPlayerStatus.currentTime + seconds
    })
  }

  const seekTo = (seconds) => {
    audioPlayerStatus.set({
      ...$audioPlayerStatus,
      currentTime: seconds
    }) 
  }

  let touchListener = null
  let touching = false
  let touchStartY = 0
  let latestTouchY = 0

  const startTouch = event => {
    //console.log("down", event?.targetTouches?.[0].identifier)
    if (touching == false) { 
      touching = true
      touchStartY = event.targetTouches?.[0]?.clientY
      handleMousemove(event.targetTouches)
      //console.log("start", event)
      touchListener = event.target.addEventListener("touchmove", event=>handleMousemove(event))
    }
  }

  const handleMousemove = event => {
    latestTouchY = event?.targetTouches?.[0]?.clientY
    //console.log(touchStartY - latestTouchY)
  }

  const endTouch = event => {
    if (touching && touchStartY - latestTouchY > 10 && !playerExpanded) {
      playerExpanded = true
    }
    if (touching && touchStartY - latestTouchY < 10 && playerExpanded) {
      playerExpanded = false
    }
    touching = false
  }

  let showDummyData =  getShowDummyDataStore();
  if($showDummyData) {
    audioPlayerStatus.set({...$audioPlayerStatus, active: true})
  }

</script>

{#if $audioPlayerStatus || $showDummyData}

  <div class="root AudioPlayer AudioPlayer--minimised minimised-container" class:active={$audioPlayerStatus.active}>

    <div class="minimised-controls">

      <div class="AudioPlayer__Close close">
        <Button dummyNoText size="small" type="link" class="AudioPlayer__Close__Button" on:click={closePlayer} title="Close">
          <Icon type="Thin-Close">
            Close
          </Icon>
        </Button>
      </div>

      {#key title}
        {#if !playerExpanded}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <h4 
              class="AudioPlayer__Title title" 
              on:click={toggleExpanded}
            >
            {title || ($showDummyData ? 'Title dummy for audio player' : '')}
          </h4>
        {/if}
      {/key}

      <div class="AudioPlayer__PlayButton playbutton">
        {#if $audioPlayerStatus.loading }
          <Loading inverse/>
        {:else}
          <Button dummyNoText type="primary" on:click={togglePlay}>
            <Icon inverse type={ $audioPlayerStatus.paused ? "Full-Play" : "Full-Pause"} />
          </Button>
        {/if}
      </div>

      <div class="AudioPlayer__ExpandCollapse expand-collapse">
        <Button dummyNoText type="link" size="small" class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type={"arrow-up"}/>
        </Button>
      </div>

    </div>

    <div class="minimised-progress-container">
      <div class="minimised-progress-bar"
        style={
          ($audioPlayerStatus?.currentTime ? 
          "width: calc(" 
          + ($audioPlayerStatus?.currentTime / $audioPlayerStatus?.duration * 100) 
          + "% + 0.875rem)" : "")
        }
      ></div>
    </div>

  </div>

{/if}

{#if $audioPlayerStatus && playerExpanded}

  <Overlay classes="root AudioPlayer AudioPlayer--expanded">

    <div class="expanded-container">

      <div class="expanded-content AudioPlayer__Content">
        <slot></slot>
      </div>

      <div class="expanded-bottom-bar AudioPlayer__BottomBar">

        <div class="expanded-range-slider AudioPlayer__Range" class:expanded={playerExpanded}>
          <input 
            type="range" 
            class="seekPositionRangeSlider AudioPlayer__Range__Input" 
            name="seekPosition"
            min="0" 
            step="0.05"
            max={$audioPlayerStatus?.duration} 
            bind:value={rangeSliderValue}
            on:input={()=>{rangeSliderDragging = true;}}
            on:change={()=>{
              seekTo(rangeSliderValue)
              rangeSliderDragging = false;
            }}
          >
        </div>

        <div class="expanded-time AudioPlayer__Time" class:expanded={playerExpanded}>
          <span class="currentTime">{format($audioPlayerStatus?.currentTime)}</span>
          <span class="duration">{format($audioPlayerStatus?.duration)}</span> 
        </div>

        <div class="expanded-controls AudioPlayer__Controls">

          <div class="AudioPlayer__Close close">
            <!--button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={()=>{toggleExpanded(); closePlayer()}} title={playerExpanded ? "Collapse" : "Expand"}>
              <Icon type="close"/>
            </button-->
          </div>

          <div class="center-controls AudioPlayer__CenterControls">

            <div class="AudioPlayer__PlayButton seekbutton">
              <Button dummyNoText size="small" type="link" on:click={()=>{seek(-30)}}>
                <Icon type="Thin-Replay-30" />
              </Button>
            </div>

            <div class="AudioPlayer__PlayButton playbutton">
              {#if $audioPlayerStatus.loading }
                <Loading inverse/>
              {:else}
                <Button dummyNoText size="large" type="primary" on:click={togglePlay}>
                  <Icon inverse type={ $audioPlayerStatus.paused ? "Full-Play" : "Full-Pause"} />
                </Button>
              {/if}
            </div>

            <div class="AudioPlayer__PlayButton seekbutton">
              <Button dummyNoText size="small" type="link" on:click={()=>{seek(15)}}>
                <Icon type={"Thin-Forward-15"} />
              </Button>
            </div>

          </div>

          <div class="AudioPlayer__ExpandCollapse expand-collapse">
            <Button dummyNoText type="link" size="small" class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
              <Icon type={"arrow-down"}/>
            </Button>
          </div>
          
        </div>

      </div>      


    </div>

  </Overlay>

{/if}

<style>

  .root {
    --audioplayer-progressbar-height: 0.25rem;
  }

  .minimised-container {
    display: none;
    width: 100%;
    /* height: 4rem; */
    background-color: var(--color-background-highlight);
    position: relative;
    box-shadow: var(--box-shadow);
  }
  
  .minimised-container.active {
    display: flex;
    flex-direction: column;
  }

  .minimised-container h4.title {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }

  h4:focus {
    outline: none;
  }

  .minimised-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem)
      calc(var(--outset-y) * 0.5rem + var(--audioplayer-progressbar-height))
      calc(var(--outset-x) * 0.5rem);
    font-size: 1.25rem;
    line-height: 1.5rem;
    font-weight: 500;
    gap: calc(var(--outset-x) * 0.5rem);
  }

  .minimised-progress-container {
    width: 100%;
    height: var(--audioplayer-progressbar-height);
    position: absolute;
    bottom: 0;
  }

  .minimised-progress-bar {
    background-color: var(--color-border-button-primary);
    height: var(--audioplayer-progressbar-height);
  }

  .expanded-container {
    background-color: var(--color-background);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .expanded-content {
    flex: 1;
    overflow-y: scroll;
  }

  .expanded-bottom-bar {
    background-color: var(--color-background-highlight);
    padding:
      calc(var(--outset-y) * 1rem)
      calc(var(--outset-x) * 0.5rem);
    box-sizing: border-box; 
  }

  .expanded-controls, .expanded-range-slider, .expanded-time {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding:
      calc(var(--outset-y) * 0.25rem)
      calc(var(--outset-x) * 0.5rem)
      0
      calc(var(--outset-x) * 0.5rem);
  }

  .expanded-controls .center-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: calc(var(--inset-x) * 1.5rem);
  }

  .expanded-time {
    margin-top: calc(var(--inset-y) * 0.5rem);
    margin-bottom: calc(var(--inset-y) * 0.5rem);
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
    height: var(--border-width);
    margin: 0;
    /* this is to have a larger target to tap */
    /* border-top: 0.5rem solid var(--color-border); 
       border-bottom: 0.5rem solid var(--color-border); */
  }

  .seekPositionRangeSlider::-moz-range-thumb {
    -webkit-appearance: none;
    height: 0.875rem;
    width: 0.875rem;
    background: var(--color-border-button-primary);
    margin-top: -0.3125rem;
    border-radius: 50%;
    border: none;
  }
  
  .seekPositionRangeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 0.875rem;
    width: 0.875rem;
    background: var(--color-border-button-primary);
    border-radius: 50%;
    border: none;
  }

  .close {
    display: flex;
  }

</style>
