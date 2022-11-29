<script context="module">
  import { get } from "svelte/store"
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")
  
  export const playAudio = async (elementRow, autoplay=true) => {
    if(elementRow) {
      if(elementRow.key == get(audioPlayerElement)?.key) {
        // if this element is already in player, just toggle paused state
        audioPlayerStatus.update( s => ({
          ...s, paused: !get(audioPlayerStatus)?.paused
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
  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import Icon from './Icon.svelte'
  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import ContentElementAudioControls from './ContentElementAudioControls.svelte'

  import marked from "marked"
  
  // import all the column information
  export let titleColumn = "elements/title"
  export let audioColumn = "elements/audio"
  export let descriptionColumn = "elements/description"
  export let imageColumn = "elements/image"
  export let locationColumn = "elements/position"
  export let categoryRefColumn = "elements/category"
  export let categoryOrderColumn = "elements/categoryOrder"
  export let colorCategoryRefColumn = "elements/category2"

  const elementColumns = {
    titleColumn,
    descriptionColumn,
    audioColumn,
    imageColumn,
    categoryRefColumn: [categoryRefColumn], 
    categoryOrderColumn: [categoryOrderColumn],
    locationColumn,
    colorCategoryRefColumn
  }

  export let categoryTitleColumn = "categories/name"
  export let categorySubtitleColumn = "categories/subtitle";
  export let categoryColorColumn = "categories2/color";

  const categoryIndex = 0;

  onMount(()=>initPlayer())

  const categoryColumns = [{
    titleColumn: categoryTitleColumn,
    subtitleColumn: categorySubtitleColumn
  }]

  const closePlayer = () => {
    mediafile = null;
    audioPlayerStatus.set({active: false})
    audioPlayerElement.set(null);
  }

  const initPlayer = closePlayer

  const togglePlay = () => {
    audioPlayerStatus.update( s => ({
      ...s, paused: !$audioPlayerStatus.paused
    }))
  }

  $: audioKey = util.rowVal($audioPlayerElement, elementColumns.audioColumn)?.value
  $: title = util.rowVal($audioPlayerElement, elementColumns.titleColumn)
  $: description = util.rowValString($audioPlayerElement, elementColumns.descriptionColumn)
  $: categoryOrderPosition = util.rowValString($audioPlayerElement, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal($audioPlayerElement, elementColumns.imageColumn)

  let playerExpanded = false;
  const toggleExpanded = () => {
    playerExpanded = !playerExpanded;
    audioPlayerStatus.update( s => ({
      ...s, expanded: playerExpanded
    }))
  }
    
  let mediafile;
  const loadAudiofile = async (key) => {
    if(key) {
      mediafile = await InterkitClient.getMediaFile(key)
    } else {
      mediafile = null;
    }
    playerExpanded = false;
  }

  $: {
    loadAudiofile(audioKey)
  } 

  let categoryRowStore;
  let categoryRow; // the row of the category that is referenced in this element

  let colorCategoryRowStore;
  let colorCategoryRow;
  let overlayColor;

  const loadCategory = async (elementRow) => {
    let categoryRowKey = util.rowVal(elementRow, elementColumns.categoryRefColumn[categoryIndex])?.rowKeys?.[0]
    //console.log("categories", util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex]))
    if(categoryRowKey) {
      let categorySheetKey = util.getSheetKey(categoryColumns[categoryIndex].titleColumn)
      categoryRowStore = await InterkitClient.getRowSubStore(categorySheetKey);
      categoryRow = $categoryRowStore.find(r => r.key == categoryRowKey)
    } else {
      categoryRow = null;
    }
  }

  const loadColor = async (elementRow) => {
    let categoryRowKey = util.rowVal(elementRow, colorCategoryRefColumn)?.rowKeys?.[0]
    //console.log(categoryRowKey)
    if(categoryRowKey) {
      let categorySheetKey = util.getSheetKey(categoryColorColumn)
      //console.log(categorySheetKey)
      colorCategoryRowStore = await InterkitClient.getRowSubStore(categorySheetKey);
      //console.log($colorCategoryRowStore)
      colorCategoryRow = $colorCategoryRowStore.find(r => r.key == categoryRowKey)
      overlayColor = util.filterColorRGB(colorCategoryRow, categoryColorColumn);
    } else {
      colorCategoryRow = null;
      overlayColor = null;
    } 
  }

  $: {
    loadCategory($audioPlayerElement)
    loadColor($audioPlayerElement)
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

    
</script>

{#if $audioPlayerStatus}

<div 
  class="AudioPlayer container" 
  class:expanded={playerExpanded} 
  class:active={$audioPlayerStatus.active}

  style={`--maxAudioPlayerHeight: ${$audioPlayerStatus.maxHeightPx}px`}
  >

    <div class="AudioPlayer__Expanded expanded-content">

      {#if imageRef}
        <figure class="AudioPlayer__Expanded__Picture">
          <MediaFileImage fitDimension="height" mediafileRef={imageRef} />    
        </figure>
      {/if}

      <ContentElementAudioControls
        element={$audioPlayerElement}
        {elementColumns}
        {categoryColumns}
        playing={$audioPlayerStatus?.active}
        size={"m"}
        duration={$audioPlayerStatus?.duration}
        useBookmarks={"TRUE"}
        {categoryRow}
        {categoryIndex}
        play={null}
        onOpenMap={toggleExpanded}
      />

      {#key title}
      <h3 class="AudioPlayer__Expanded__Title">
        {title}
      </h3>
      {/key}
      
      <h4 class="AudioPlayer__Expanded__SubTitle">
        <span>
          {util.rowValString(categoryRow, categoryColumns[categoryIndex].titleColumn)}
        </span>
        {#if categoryOrderPosition}
          <span>
            {categoryOrderPosition}
          </span>
          – 
        {/if}
        <span>
          {util.rowValString(categoryRow, categoryColumns[categoryIndex].subtitleColumn)}
        </span>
      </h4>  

      <p class="AudioPlayer__Expanded__Description">
        {#if description}
          {@html marked(description)}
        {/if}
      </p>

    </div>

    <div class="AudioPlayer__GrabIndicator" 
      on:click={toggleExpanded}
      on:touchstart={ startTouch }
      on:touchend={ endTouch }
      class:expanded={playerExpanded}
      >
    </div>

    <div class="AudioPlayer__Content base-content">

      <div class="AudioPlayer__ExpandCollapse expand-collapse">
        <button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type={playerExpanded ? "arrow-down" : "arrow-up"}>
            {playerExpanded ? "Collapse" : "Expand"}
          </Icon>
        </button>
      </div>

      <div class="AudioPlayer__PlayButton seekbutton">
        <Button inverse on:click={()=>{seek(-30)}}>
          <Icon inverse type={"skip-backward"} />
        </Button>
      </div>

      <div class="AudioPlayer__PlayButton playbutton">
        {#if $audioPlayerStatus.loading }
          <Loading inverse/>
        {:else}
          <Button inverse on:click={togglePlay}>
            <Icon inverse type={ $audioPlayerStatus.paused ? "play" : "pause"} />
          </Button>
        {/if}
      </div>

      <div class="AudioPlayer__PlayButton seekbutton">
        <Button inverse on:click={()=>{seek(10)}}>
          <Icon inverse type={"skip-forward"} />
        </Button>
      </div>


      {#key title}
      <h4 
          class="AudioPlayer__Title title" 
          on:click={toggleExpanded}
        >
        {title}
      </h4>
      {/key}



    {#key mediafile}
      {#if mediafile}
        <span class="AudioPlayer__Audioplayer audio">
          <audio 
            id="audio"
            controls
            on:playing={() => { 
              if($audioPlayerStatus.loading) {
                audioPlayerStatus.update(s=>({...s, loading: false}))
                //console.log("playing")
              }
            }}
            bind:currentTime={$audioPlayerStatus.currentTime}
            bind:duration={$audioPlayerStatus.duration}
            bind:paused={$audioPlayerStatus.paused} 
            autoplay={$audioPlayerStatus.autoplay}
          >
            <source src={encodeURI(mediafile.link)} type="audio/mpeg">
          </audio>
        </span>

        
      {/if}
    {/key}

    <div class="AudioPlayer__Close close">
      {#if playerExpanded}
        <button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type="close">
            Close
          </Icon>
        </button>
      {:else}
        <button class="AudioPlayer__Close__Button" on:click={closePlayer} title="Close">
          <Icon type="close">
            Close
          </Icon>
        </button>
      {/if}
    </div>

  </div>

  <div class="AudioPlayer__Expanded__Time" class:expanded={playerExpanded}>
        <span class="currentTime">{format($audioPlayerStatus?.currentTime)}</span>
        <span class="duration">{format($audioPlayerStatus?.duration)}</span> 
  </div>

  <div class="AudioPlayer__Expanded__Controls" class:expanded={playerExpanded}>
    <input 
      type="range" 
      class="seekPositionRangeSlider" 
      name="seekPosition"
      min="0" 
      max={$audioPlayerStatus?.duration} 
      bind:value={rangeSliderValue}
      on:input={()=>{rangeSliderDragging = true;}}
      on:change={()=>{
        seekTo(rangeSliderValue)
        rangeSliderDragging = false;
      }}
    >
  </div>

  <div class="AudioPlayer__Overlay__Container overlay_container">
    <div class="AudioPlayer__Overlay overlay"
      style={
        (overlayColor ? ("background:" + overlayColor + "; ") : "")
        + ($audioPlayerStatus?.currentTime ? 
        "width: calc(" 
        + ($audioPlayerStatus?.currentTime / $audioPlayerStatus?.duration * 100) 
        + "% + 14px)" : "")
      }
    ></div>
  </div>

</div>

{/if}

<style>

  .container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    background-color: lightgrey;
    border: solid 1px black;
    border-bottom-width: 0;
    position: relative;
    z-index: 1000;
    pointer-events: auto;
    touch-action: auto;
    bottom:0;
    transition: height .5s;
    height: 0;
    will-change: height;
  }

  .container.active {
    height: 72px;
  }

  @media (hover: hover) and (pointer: fine) {
    .container.active { /* mouse pointer devices don't need grab indicator */
      height: 60px;
    }
  }

  .container.expanded {
    height: var(--maxAudioPlayerHeight);
    /*position: absolute;*/
  }

  .base-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    height: 60px;
  }

  .expanded-content {
    flex:1;
  }

  .container:not(.expanded) .expanded-content {
    max-height: 0;
    overflow: hidden;
  }

  .container.expanded .base-content .title {
    /*display: none;*/
  }

  .container.expanded .base-content {
    justify-content: space-between;
  }

  .container.expanded .expanded-content {
    overflow-y: auto;
    flex: 1;
  }

  .base-content > * {
    margin: 0 4px;
  }

  .expand {}
  .title {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
  }
  .close {}

  .icon-close {
    padding: 0 12px;
  }

  button {
    border: none;
    outline: none;
  }

  .playbutton {
    margin: 0 8px;
  }

  .AudioPlayer__Expanded {
    padding-top: 0px;
    /*padding-bottom: 32px;*/
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .AudioPlayer__Expanded__Picture {
    height: 170px;
    max-height: 25vh;
    padding-bottom: 8px;
    order: 1;
  }

  .AudioPlayer__Expanded__Title,
  .AudioPlayer__Expanded__SubTitle,
  .AudioPlayer__Expanded__Description {
    padding: 0 16px;
  }

  .AudioPlayer__Expanded__Title {
    order: 3;
  }
  .AudioPlayer__Expanded__SubTitle {
    order: 2;
    text-transform: uppercase;
    font-size: 10px;
  }

  .AudioPlayer__Expanded__Description {
    order: 3;
  }

  .AudioPlayer__Expanded__Description {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .AudioPlayer__GrabIndicator {
    height: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: black;
  }

  
  @media (hover: hover) and (pointer: fine) { /* mouse pointer devices don't need grab indicator */
    .AudioPlayer__GrabIndicator {
      /*display: none;*/
    }
  }
  

  .AudioPlayer__GrabIndicator::after {
    content: "";
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
  }
  .AudioPlayer__GrabIndicator.expanded {
    display: none;
  }

  .AudioPlayer__Expanded__Controls:not(.expanded), .AudioPlayer__Expanded__Time:not(.expanded) {
    display: none;
  }

  .AudioPlayer__Expanded__Controls, .AudioPlayer__Expanded__Time {
    width: 100%;
    height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 12px 12px 12px;
    box-sizing: border-box;
  }

  :not(.expanded) .base-content .seekbutton {
    display: none;
  }
  
  .audio, audio {
    display:none;
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

  .overlay_container {
    display: none;
  }

</style>