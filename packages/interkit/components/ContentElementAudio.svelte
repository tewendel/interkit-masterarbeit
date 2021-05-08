<script>

  import { onMount } from 'svelte';

  import { InterkitClient, util } from '../'
  
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  
  import MediaFileImage from './MediaFileImage.svelte'
  import BookmarkToggle from './BookmarkToggle.svelte'
  import Button from './Button.svelte'
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
  // m - used in map - small image, no description
  // l - used in dashboard sliders and elementlist
  
  // use this to specify a bookmark list
  export let bookmarkFilter = "bookmarks";
  
  $: title = util.rowVal(element, elementColumns.titleColumn)
  $: supertext = util.rowVal(element, elementColumns.supertextColumn)
  $: description = util.rowValString(element, elementColumns.descriptionColumn)
  $: short_description = util.rowValString(element, elementColumns.shortDescriptionColumn)
  $: categoryOrderPosition = util.rowValString(element, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal(element, elementColumns.imageColumn)
  $: playing = element && (element.key == $audioPlayerStatus?.elementRow?.key)

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

  const play = async () => {
    if(typeof element.onPlay == "function") {
      element.onPlay();
    }
    await playAudio(element)      
  }

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");
  let distance = "";
  const calculateDistance = (userPosition) => {
    let elementPosition = util.rowVal(element, elementColumns.locationColumn);
    let meters = util.getDistance(elementPosition, userPosition)
    if(meters) {
      if(meters < 1000) distance = meters + "m";
      else distance = Math.floor(meters / 1000) + "km";
    }
  }

  $: {
    calculateDistance($userPositionStore)
  }

</script>

<section class={`ContentElementAudio container size-${size}`}>

  <figure class="ContentElementAudio__Picture picture">
    <MediaFileImage mediafileRef={imageRef} />    
  </figure>
  
  <div class="ContentElementAudio__Controls controls">
    {#if util.rowVal(element, elementColumns.audioColumn)}
    <span class="ContentElementAudio__Play play">
      <Button on:click={play}>
        {#if playing}
          <Icon height="1em" type={ $audioPlayerStatus.paused ? "play" : "pause"} />
        {:else}
          <Icon height="1em" type="play" />
          &thinsp;
          play
        {/if}
      </Button>
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

  <div class="ContentElementAudio__Content content">
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

    <p class="ContentElementAudio__Description description">
      {short_description}
    </p>

    {#if util.rowVal(element, elementColumns.linkColumn)}
      <a class="ContentElementAudio__Link link" target="_blank" href="{util.rowVal(element, elementColumns.linkColumn)}">link</a>
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

  .content {
    grid-column: 1;
    grid-row: 3;
    display: flex;
    flex-direction: column;
  }

  .content .title {
    order: 2;
  }

  .content .subtitle {
    order: 1;
  }

  .content .description {
    order: 3;
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

  /* elements */

  .content {
    padding: 16px;
  }

  .description {
    margin-top: 8px;
  }

  /* size variants */

  .container.size-m .picture {
    width: 25%; 
  }

  .container.size-xs .controls .bookmark, 
  .container.size-xs .picture, 
  .container.size-xs .content .subtitle,
  .container.size-xs .content .description,
  .container.size-xs .content .link {
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