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

<div class="AudioPlayer container">

  {#if !playerExpanded}
    <h4 class="AudioPlayer__Title title">{title}</h4>
    <div class="AudioPlayer__Expand expand">
    <button class="AudioPlayer__Expand__Button icon-expand icon" on:click={toggleExpanded} title="Expand">
      expand
    </button>
  </div>
  {:else}
    <div class="expanded-content">
      <MediaFileImage mediafileRef={imageRef} />    
      <h4>
        <span>{util.rowValString(categoryRow, categoryColumns[categoryIndex].titleColumn)}</span>
        {#if categoryOrderPosition}<span>{categoryOrderPosition}</span> – {/if}
        <span>{util.rowValString(categoryRow, categoryColumns[categoryIndex].subtitleColumn)}</span>
      </h4>  
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <button class="AudioPlayer__Expand__Button icon-collapse icon" on:click={toggleExpanded} title="Expand">
      collapse
    </button>
  {/if}

  {#key mediafile}
    {#if mediafile}
    <audio style="width: 100%" controls autoplay={$audioPlayerStatus.autoplay}>
      <source src={encodeURI(mediafile.link)} type="audio/mpeg">
    </audio>
    {/if}
  {/key}

  <div class="AudioPlayer__Close close">
    <button class="AudioPlayer__Close__Button icon-close icon" on:click={closePlayer} title="Close">
      Close
    </button>
  </div>

</div>

{/if}

<style>

  .container {
    box-sizing: border-box;
    width: 100%;
    background-color: lightgrey;
    border: solid 1px black;
    border-bottom-width: 0;
    padding: 4px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 1000;
  }

  .container > * {
    margin: 0 4px;
  }

  .expand {}
  .title {
    flex: 1;
    text-overflow: ellipsis;
  }
  .close {}

  .icon {
    background-repeat: no-repeat;
    background-size: 25px;
    background-position: center;
    color: transparent;
    border: none;
    width: 25px;
    height: 25px;
    margin: 0 4px;
    cursor: pointer;
    user-select: none;
  }
  .icon-expand {
    background-image: url("../icons/Arrow-Up.svg");
  }

  .icon-collapse {
    background-image: url("../icons/Dropdown.svg");
  }
  .icon-close {
    background-image: url("../icons/Close.svg");
    padding: 0 12px;
  }

</style>