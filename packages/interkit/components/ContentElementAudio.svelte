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

  export let size = "m"

  // xs - used in dashboard, no image, no description, no category info
  // s - used in bookmark list, small image, no description

  // use this to specify a bookmark list
  export let bookmarkFilter = "bookmarks";
  
  let projectId = INTERKIT_PROJECT_ID

  $: title = util.rowVal(element, elementColumns.titleColumn)
  $: description = util.rowValString(element, elementColumns.descriptionColumn)
  $: categoryOrderPosition = util.rowValString(element, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal(element, elementColumns.imageColumn)
  $: playing = element && (element.key == $audioPlayerStatus?.elementRow?.key)

  let categoryRow; // the row of the category that is referenced in this element
  const setupCategory = async (element) => {
    let categoryRowKey = util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex])?.rowKeys?.[0]
    console.log("categories", util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex]))
    if(categoryRowKey)
      categoryRow = await InterkitClient.call("row.get", {projectId, key: categoryRowKey});
    console.log("categoryRow", categoryRow)
  }

  $: {
    setupCategory(element)
  }

  const play = async () => {
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

<section class="ContentElementAudio container">

  {#if size != "xs"}
    <figure class="ContentElementAudio__Picture picture">
      <MediaFileImage mediafileRef={imageRef} />    
    </figure>
  {/if}

  <div class="ContentElementAudio__Controls controls">
    <span class="ContentElementAudio__Play play">
      <Button on:click={play}>
        {#if playing}
          (playing)
        {:else}
          <Icon height="1em" type="play" />
          play
        {/if}
      </Button>
    </span>

    <span class="ContentElementAudio__Distance distance">
      <Button>
        {distance}
      </Button>
    </span>

    {#if size != "xs"}
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

    {#if size != "xs"}
      <h4 class="ContentElementAudio__SubTitle subtitle">
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
      <p class="ContentElementAudio__Description description">
        {description}
      </p>
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


</style>