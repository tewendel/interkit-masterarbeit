<script>

  import { onMount } from 'svelte';
  import { get } from "svelte/store"
  import marked from "marked"

  import { InterkitClient, util } from '../'
  
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")
  
  import MediaFileImage from './MediaFileImage.svelte'
  import BookmarkToggle from './BookmarkToggle.svelte'
  import Button from './Button.svelte'
  import AudioPlayButton from './AudioPlayButton.svelte'
  import Icon from './Icon.svelte'

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  //console.log("ContentElementAudio", element)

  export let elementColumns;
  export let categoryColumns;
  export let categoryIndex = 0;

  // get size from prop, or from element passed in, or default to "l"
  export let size = element.size || "l"

  // xs - used in dashboard, no image, no description, no category info
  // s - used in bookmark list, small image, no description
  // m - used in map - small image, description
  // l - used in dashboard sliders and elementlist
  
  // use this to specify a bookmark list
  export let bookmarkFilter = "bookmarks";
  
  $: title = util.rowVal(element, elementColumns.titleColumn)
  $: supertext = util.rowVal(element, elementColumns.supertextColumn)
  $: description = util.rowValString(element, elementColumns.descriptionColumn)
  $: short_description = util.rowValString(element, elementColumns.shortDescriptionColumn)
  $: categoryOrderPosition = util.rowValString(element, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal(element, elementColumns.imageColumn)
  $: playing = element && (element.key == $audioPlayerElement?.key) && $audioPlayerStatus?.active

  let categoryRowStore;
  let categoryRow; // the row of the category that is referenced in this element
  const setupCategory = async (element) => {
    let categoryRowKey = util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex])?.rowKeys?.[0]
    //console.log("categories", util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex]))
    if(categoryRowKey) {
      let categorySheetKey = util.getSheetKey(categoryColumns[categoryIndex].titleColumn)
      categoryRowStore = await InterkitClient.getRowSubStore(categorySheetKey);
      categoryRow = $categoryRowStore.find(r => r.key == categoryRowKey)
    }    
  }

  $: {
    setupCategory(element)
  }

  let duration;
  const getDuration = async (_element) => {
    let audioKey = util.rowVal(_element, elementColumns.audioColumn)?.value
    let mediaFile = await InterkitClient.getMediaFile(audioKey);
    //console.log(mediaFile);
    duration = mediaFile?.meta?.duration;
  }

  $: {
    getDuration(element)
  }

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");
  let distanceMeters;
  let distance = "";

  const formatDistance  = (meters) => {
    let d = "";
    if(meters < 1000) d = meters + "m";
    else d = Math.floor(meters / 1000) + "km";
    return d;
  }

  const calculateDistance = (userPosition) => {
    let elementPosition = util.rowVal(element, elementColumns.locationColumn);
    distanceMeters = util.getDistance(elementPosition, userPosition)
    if(distanceMeters) {
      distance = formatDistance(distanceMeters)
    }
  }

  $: {
    calculateDistance($userPositionStore)
  }

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")

  const play = async () => {

    if(typeof element.onPlay == "function") {
      element.onPlay();
    }

    // check if this has a minDistance set
    let minDistance = util.rowVal(element, elementColumns.minDistanceColumn)
    console.log("minDistance", minDistance, distanceMeters)
    
    // check if this has been unlocked
    let unlocked = get(elementProperties)?.[element.key]?.unlocked;
    console.log("unlocked status:", unlocked)

    // check if we can play this
    if(
      !distanceMeters || // we have no info about users distance, for example gps broken
      unlocked || // this has alreaddy been unlocked
      !minDistance || // there is no minDistance set
      (minDistance && distanceMeters < minDistance) // we are inside the appropriate distance
    ) {
      // if close enough, start playback and mark as unlocked
      await playAudio(element)      
      if(!unlocked)
        InterkitClient.setElementProperty(elementProperties, element.key, "unlocked", true)  
    } else {
      // if not, refuse playback with info  
      alert("Sie sind zu weit entfernt, um das Audio freizuschalten! Aktuelle Entfernung: " + distance)
    }
    
  }





</script>

<section class={`ContentElementAudio container size-${size}`}>

  <figure class="ContentElementAudio__Picture picture">
    <MediaFileImage mediafileRef={imageRef} />    
  </figure>
  
  <div class="ContentElementAudio__Controls controls">
    {#if util.rowVal(element, elementColumns.audioColumn)}
    <span class="ContentElementAudio__Play play">
      <AudioPlayButton
        {playing}
        onTap={play}
        paused={$audioPlayerStatus?.paused}
        loading={$audioPlayerStatus?.loading}
      />
      <span class="ContentElementAudio__Duration">{util.formatDuration(duration)}</span>
    </span>
    {/if}

    {#if util.rowVal(element, elementColumns.locationColumn)}
    <span class="ContentElementAudio__Distance distance">
      <Button>
        {distance}
      </Button>
    </span>
    {/if}

    {#if !util.rowVal(categoryRow, categoryColumns[categoryIndex].unlistedColumn)}
      <span class="ContentElementAudio__Bookmark bookmark">
        <Button>
          <BookmarkToggle elementKey={element?.key}/>
        </Button>
      </span>      
    {/if}
  
  </div>

  <!-- special for the gate: add an extra bookmark toggle -->
  {#if !util.rowVal(categoryRow, categoryColumns[categoryIndex].unlistedColumn)}
  <span class="ContentElementAudio__Bookmark_extra bookmark_extra">
        <Button>
          <BookmarkToggle close elementKey={element?.key}/>
        </Button>
  </span>
  {/if}
  <!-- end special -->

  
  <div class="ContentElementAudio_Titles titles">

    <h3 class="ContentElementAudio__Title title">
      {title}
    </h3>

    <h4 class="ContentElementAudio__SubTitle subtitle">
      {#if supertext}
        <span>{supertext}</span>
      {:else}
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
      {/if}
    </h4>

  </div>

  <div class="ContentElementAudio__Content content">
    
    <p class="ContentElementAudio__Description description">
      {#if short_description}
        {@html marked(short_description)}
      {/if}
    </p>

    {#if util.rowVal(element, elementColumns.linkColumn)}
      <div class="link_container">
        <a class="ContentElementAudio__Link link" target="_blank" href="{util.rowVal(element, elementColumns.linkColumn)}">LINK</a>
      </div>
    {/if}
    
  </div>

</section>

<style>

  /* Layout */

  .container {
    display: grid;
    grid-template-rows: auto auto auto;
  }
  .picture {
    grid-column: 1;
    grid-row: 1 / span 2;
  }
  
  .controls {
    grid-column: 1;
    grid-row: 2;
  }

  .titles {
    grid-column: 1;
    grid-row: 3;
    display: flex;
    flex-direction: column;
  }

  .content {
    grid-column: 1;
    grid-row: 4;
    display: flex;
    flex-direction: column;
  }

  .titles .title {
    order: 2;
  }

  .titles .subtitle {
    order: 1;
  }

  .content .description {
    order: 1;
  }

  .content .link_container {
    order: 2;
  }

  /* Controls Layout */

  .controls {
    display: flex;
    padding: 8px;
  }

  .controls > *:not(:first-child) {
    margin-left: 8px;
  }
  .play {
    flex: 1;
  }

  .play {
    height: 2em;
    line-height: 2em;
  }

  .play span {
    vertical-align: middle;
  }

  /* elements */

  .titles {
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .content {
    padding: 16px;
  }

  .description {
    margin-top: 8px;
  }

  /* size variants */

  .container.size-s .description {
    display: none;
  }

  .container.size-s .picture, .container.size-m .picture {
    width: 25%; 
  }

  .container.size-xs .controls .bookmark, 
  .container.size-xs .picture, 
  .container.size-xs .titles .subtitle,
  .container.size-xs .content {
    display: none;
  }

  .ContentElementAudio__Bookmark_extra {
    display: none;
  }

  .container.size-xs {
    height: 66vh;
    display: flex;
    flex-direction: column;
    place-items: center;
    place-content: center;
    background-color: var(--color-background-highlight);
  }


</style>