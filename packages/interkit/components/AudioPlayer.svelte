<script context="module">
  import { get } from "svelte/store"
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  import { util } from "../"
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
  }

  export const format = (seconds) => {
    if (isNaN(seconds)) return '...';

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
  }

</script>

<script>
  import { onMount, setContext } from 'svelte'
  import { InterkitClient } from '../'
  import Icon from './Icon.svelte'
  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Overlay from "./Overlay.svelte";
  
  // import all the column information
  export let titleColumn = "elements/title"
  export let audioColumn = "elements/audio"
  
  const elementColumns = {
    titleColumn,
    audioColumn,
  }

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")
  setContext("element", audioPlayerElement)
  $: title = util.rowVal($audioPlayerElement, elementColumns.titleColumn)
  
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
  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const markElementListened = (time) => {
    if(time > 20) {
      let key = $audioPlayerElement?.key
      if(key && !get(elementProperties)?.[key]?.checked) {
        InterkitClient.setElementProperty(elementProperties, key, "checked", true)  
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

  <div class="minimised-container" class:active={$audioPlayerStatus.active}>

    <div class="minimised-controls">

      <div class="AudioPlayer__Close close">
        <Button size="small" type="link" class="AudioPlayer__Close__Button" on:click={closePlayer} title="Close">
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
            {title}
          </h4>
        {/if}
      {/key}

      <div class="AudioPlayer__PlayButton playbutton">
        {#if $audioPlayerStatus.loading }
          <Loading inverse/>
        {:else}
          <Button type="primary" on:click={togglePlay}>
            <Icon inverse type={ $audioPlayerStatus.paused ? "Full-Play" : "Full-Pause"} />
          </Button>
        {/if}
      </div>

      <div class="AudioPlayer__ExpandCollapse expand-collapse">
        <Button type="link" size="small" class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type={"arrow-up"}/>
        </Button>
      </div>

    </div>

    <div class="minimsed-progress-container">
      <div class="minimised-progress-bar"
        style={
          ($audioPlayerStatus?.currentTime ? 
          "width: calc(" 
          + ($audioPlayerStatus?.currentTime / $audioPlayerStatus?.duration * 100) 
          + "% + 14px)" : "")
        }
      ></div>
    </div>

  </div>

{/if}

{#if $audioPlayerStatus && playerExpanded}

  <Overlay>

    <div class="expanded-container">

      <div class="expanded-content">
        <slot></slot>
      </div>

      <div class="expanded-bottom-bar">

        <div class="expanded-range-slider" class:expanded={playerExpanded}>
          <input 
            type="range" 
            class="seekPositionRangeSlider" 
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

        <div class="expanded-time" class:expanded={playerExpanded}>
          <span class="currentTime">{format($audioPlayerStatus?.currentTime)}</span>
          <span class="duration">{format($audioPlayerStatus?.duration)}</span> 
        </div>

        <div class="expanded-controls">

          <div class="AudioPlayer__Close close">
            <!--button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={()=>{toggleExpanded(); closePlayer()}} title={playerExpanded ? "Collapse" : "Expand"}>
              <Icon type="close"/>
            </button-->
          </div>

          <div class="center-controls">

            <div class="AudioPlayer__PlayButton seekbutton">
              <Button size="small" type="link" on:click={()=>{seek(-30)}}>
                <Icon type="Thin-Replay-30" />
              </Button>
            </div>

            <div class="AudioPlayer__PlayButton playbutton">
              {#if $audioPlayerStatus.loading }
                <Loading inverse/>
              {:else}
                <Button size="large" type="primary" on:click={togglePlay}>
                  <Icon inverse type={ $audioPlayerStatus.paused ? "Full-Play" : "Full-Pause"} />
                </Button>
              {/if}
            </div>

            <div class="AudioPlayer__PlayButton seekbutton">
              <Button size="small" type="link" on:click={()=>{seek(15)}}>
                <Icon type={"Thin-Forward-15"} />
              </Button>
            </div>

          </div>

          <div class="AudioPlayer__ExpandCollapse expand-collapse">
            <Button type="link" size="small" class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
              <Icon type={"arrow-down"}/>
            </Button>
          </div>
          
        </div>

      </div>      


    </div>

  </Overlay>

{/if}

<style>

  .minimised-container {
    display: none;
    width: 100%;
    height: 64px;
    background-color: var(--color-background-highlight);
    position: relative;
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

  .minimised-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 12px;
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    gap: var(--distance-s);
  }

  .minimsed-progress-container {
    width: 100%;
    height: var(--distance-xs);
    position: absolute;
    bottom: 0px;
  }

  .minimised-progress-bar {
    background-color: black;
    height: 4px;
  }

  .expanded-container {
    background-color: white;
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
    background-color: #eee;
    padding: 16px 8px;
    box-sizing: border-box; 
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
    
  }

  .expanded-time {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .expanded-time span {
    font: var(--font-caption);
  }

  :not(.expanded) .base-content .seekbutton {
    display: none;
  }
  
  .seekPositionRangeSlider {
    width: 100%;
    -webkit-appearance: none;
    background-color: #000; 
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
    background: #000;
    margin-top: -5px;
    border-radius: 50%;
    border: none;
  }
  
  .seekPositionRangeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    background: #000;
    border-radius: 50%;
    border: none;
  }

</style>