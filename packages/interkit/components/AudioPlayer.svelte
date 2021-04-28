<script context="module">
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  export const playAudio = async (elementRow, autoplay=true) => {
    audioPlayerStatus.set({
      elementRow,
      autoplay
    })
  }
</script>

<script>
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import Icon from './Icon.svelte'

  let projectId = INTERKIT_PROJECT_ID
  
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
    audioPlayerStatus.set(null)
  }

  $: audioKey = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.audioColumn)?.value
  $: title = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.titleColumn)
  $: description = util.rowValString($audioPlayerStatus?.elementRow, elementColumns.descriptionColumn)
  $: categoryOrderPosition = util.rowValString($audioPlayerStatus?.elementRow, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal($audioPlayerStatus?.elementRow, elementColumns.imageColumn)

  let mediafile;
  const loadAudiofile = async (key) => {
    if(key) {
      mediafile = await InterkitClient.call("mediafile.get", {key, projectId})
    } else {
      mediafile = null;
    }
  }

  $: {
    loadAudiofile(audioKey)
  } 

  let categoryRow; // the row of the category that is referenced in this element

  const loadCategory = async (elementRow) => {
    let categoryRowKey = util.rowVal(elementRow, elementColumns.categoryRefColumn[categoryIndex])?.rowKeys?.[0]
    if(categoryRowKey)
      categoryRow = await InterkitClient.call("row.get", {projectId, key: categoryRowKey});
    else 
      categoryRow = null;
    //console.log(categoryRow)
  }

  $: {
    loadCategory($audioPlayerStatus?.elementRow)
  }

  let playerExpanded = false;
  const toggleExpanded = () => {
    playerExpanded = !playerExpanded;
  }
    
</script>

{#if $audioPlayerStatus}

<div class="AudioPlayer container" class:expanded={playerExpanded}>

    <div class="AudioPlayer__Expanded expanded-content">

      <figure class="AudioPlayer__Expanded__Picture">
        <MediaFileImage fitDimension="height" mediafileRef={imageRef} />    
      </figure>

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
        {description}
      </p>
    </div>

    <div class="base-content">

      <div class="AudioPlayer__ExpandCollapse expand-collapse">
        <button class="AudioPlayer__Expand__Button icon-expand-collapse" on:click={toggleExpanded} title={playerExpanded ? "Collapse" : "Expand"}>
          <Icon type={playerExpanded ? "arrow-down" : "arrow-up"}>
            {playerExpanded ? "Collapse" : "Expand"}
          </Icon>
        </button>
      </div>

      <h4 class="AudioPlayer__Title title">
        {title}
      </h4>

    {#key mediafile}
      {#if mediafile}
        <span class="AudioPlayer__Audioplayer audio">
          <audio controls autoplay={$audioPlayerStatus.autoplay}>
            <source src={encodeURI(mediafile.link)} type="audio/mpeg">
          </audio>
        </span>
      {/if}
    {/key}

    <div class="AudioPlayer__Close close">
      <button class="AudioPlayer__Close__Button icon-close icon" on:click={closePlayer} title="Close">
        <Icon type="close">
          Close
        </Icon>
      </button>
    </div>

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
  }

  .container:not(.expanded) .expanded-content {
    display: none;
  }

  .base-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px;
  }

  .base-content > * {
    margin: 0 4px;
  }

  .expand {}
  .title {
    flex: 1;
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

  .AudioPlayer__Expanded {
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
    overflow-y: scroll;
  }

  .AudioPlayer__Expanded__Description {
    padding-top: 16px;
  }

</style>