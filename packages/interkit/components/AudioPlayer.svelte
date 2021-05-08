<script context="module">
  import { get } from "svelte/store"
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  export const playAudio = async (elementRow, autoplay=true) => {
    if(elementRow) {
      if(elementRow.key == get(audioPlayerStatus)?.elementRow?.key) {
        // if this element is already in player, just toggle paused state
        audioPlayerStatus.update( s => ({
          ...s, paused: !get(audioPlayerStatus)?.paused
        })) 
      } else {
        // new element, reset
        audioPlayerStatus.set({
          active: true,
          elementRow,
          autoplay,
          paused: false,
          currentTime: 0
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
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import Icon from './Icon.svelte'
  import Button from './Button.svelte'

  import marked from "marked"
  
  // import all the column information
  export let titleColumn = "elements/title"
  export let audioColumn = "elements/audio"
  export let descriptionColumn = "elements/description"
  export let imageColumn = "elements/image"
  export let locationColumn = "elements/position"
  export let categoryRefColumn = "elements/category"
  export let categoryOrderColumn = "elements/categoryOrder"

  const elementColumns = {
    titleColumn,
    descriptionColumn,
    audioColumn,
    imageColumn,
    categoryRefColumn: [categoryRefColumn], 
    categoryOrderColumn: [categoryOrderColumn],
    locationColumn,
  }

  export let categoryTitleColumn = "categories/name"
  export let categorySubtitleColumn = "categories/subtitle";

  const categoryIndex = 0;
  
  const categoryColumns = [{
    titleColumn: categoryTitleColumn,
    subtitleColumn: categorySubtitleColumn
  }]

  const closePlayer = () => {
    mediafile = null;
    audioPlayerStatus.set({active: false})
  }

  const togglePlay = () => {
    audioPlayerStatus.update( s => ({
      ...s, paused: !$audioPlayerStatus.paused
    }))
  }

  $: audioKey = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.audioColumn)?.value
  $: title = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.titleColumn)
  $: description = util.rowValString($audioPlayerStatus?.elementRow, elementColumns.descriptionColumn)
  $: categoryOrderPosition = util.rowValString($audioPlayerStatus?.elementRow, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.imageColumn)

  let playerExpanded = false;
  const toggleExpanded = () => {
    playerExpanded = !playerExpanded;
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

  $: {
    loadCategory($audioPlayerStatus?.elementRow)
  }

  const seek = (seconds) => {
    audioPlayerStatus.set({
      ...$audioPlayerStatus,
      currentTime: $audioPlayerStatus.currentTime + seconds
    })
  }
    
</script>

{#if $audioPlayerStatus?.active}

<div class="AudioPlayer container" class:expanded={playerExpanded}>

    <div class="AudioPlayer__Expanded expanded-content">

      {#if imageRef}
        <figure class="AudioPlayer__Expanded__Picture">
          <MediaFileImage fitDimension="height" mediafileRef={imageRef} />    
        </figure>
      {/if}

      <h3 class="AudioPlayer__Expanded__Title">
        {title}
      </h3>
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

    <div class="AudioPlayer__Content base-content">

      <div class="AudioPlayer__ExpandCollapse expand-collapse">
        <button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type={playerExpanded ? "arrow-down" : "arrow-up"}>
            {playerExpanded ? "Collapse" : "Expand"}
          </Icon>
        </button>
      </div>

      <div class="AudioPlayer__PlayButton backbutton expanded-content">
        <Button inverse on:click={()=>{seek(-30)}}>
          <Icon inverse type={"skip-backward"} />
        </Button>
      </div>

      <div class="AudioPlayer__PlayButton playbutton">
        <Button inverse on:click={togglePlay}>
          <Icon inverse type={ $audioPlayerStatus.paused ? "play" : "pause"} />
        </Button>
      </div>

      <div class="AudioPlayer__PlayButton backbutton expanded-content">
        <Button inverse on:click={()=>{seek(10)}}>
          <Icon inverse type={"skip-forward"} />
        </Button>
      </div>


      <h4 class="AudioPlayer__Title title" on:click={toggleExpanded}>
        {title}
      </h4>



    {#key mediafile}
      {#if mediafile}
        <span class="AudioPlayer__Audioplayer audio">
          <audio 
            controls
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
      <button class="AudioPlayer__Close__Button" on:click={closePlayer} title="Close">
        <Icon type="close">
          Close
        </Icon>
      </button>
    </div>

  </div>

  <div class="AudioPlayer__Expanded__Controls" class:expanded={playerExpanded}>
        <span class="currentTime">{format($audioPlayerStatus?.currentTime)}</span>
        <span class="duration">{format($audioPlayerStatus?.duration)}</span> 
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
    position: absolute;
    bottom: 0;
  }

  .container.expanded {
    height: 100%
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

  .container:not(.expanded) .expanded-content {
    display: none;
  }

  .container.expanded .base-content .title {
    display: none;
  }

  .container.expanded .base-content {
    justify-content: space-between;
  }

  .container.expanded .expanded-content {
    overflow-y: scroll;
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
    padding-top: 16px;
    padding-bottom: 32px;
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
  }

  .AudioPlayer__Expanded__Description {
    order: 3;
  }

  .AudioPlayer__Expanded__Description {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .AudioPlayer__Expanded__Controls:not(.expanded) {
    display: none;
  }

  .AudioPlayer__Expanded__Controls {
    width: 100%;
    height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 12px 12px 12px;
    box-sizing: border-box;
  }
  
  .audio, audio {
    display:none;
  }

</style>