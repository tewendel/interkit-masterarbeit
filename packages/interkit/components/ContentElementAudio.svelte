<script>

  import { onMount } from 'svelte';

  import { InterkitClient, util } from '../'
  
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  
  import MediaFileImage from './MediaFileImage.svelte'

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  //console.log("ContentElementAudio", element)

  export let elementColumns;
  export let categoryColumns;
  export let categoryIndex = 0;

  export let size = "m"
  // xs - used in dashboard, no image, no description, no category info
  // s - used in bookmark list, small image, no description
  
  let projectId = INTERKIT_PROJECT_ID

  $: audioKey = util.rowVal(element, elementColumns.audioColumn)?.value
  $: title = util.rowVal(element, elementColumns.titleColumn)
  $: description = util.rowValString(element, elementColumns.descriptionColumn)
  $: categoryOrderPosition = util.rowValString(element, elementColumns.categoryOrderColumn[categoryIndex])
  $: imageRef = util.rowVal(element, elementColumns.imageColumn)

  let categoryRow; // the row of the category that is referenced in this element

  onMount(async () => {
    let categoryRowKey = util.rowVal(element, elementColumns.categoryRefColumn[categoryIndex])?.rowKeys?.[0]
    if(categoryRowKey)
      categoryRow = await InterkitClient.call("row.get", {projectId, key: categoryRowKey});
    //console.log(categoryRow)
  })

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

<section class="ContentElementAudio">
  {#if size != "xs"}
    <MediaFileImage mediafileRef={imageRef} />    
  {/if}
  <span>{distance}</span>
  <h3>{title}</h3>
  {#if size != "xs"}
    <h4>
      <span>{util.rowValString(categoryRow, categoryColumns[categoryIndex].titleColumn)}</span>
      {#if categoryOrderPosition}<span>{categoryOrderPosition}</span> – {/if}
      <span>{util.rowValString(categoryRow, categoryColumns[categoryIndex].subtitleColumn)}</span>
    </h4>  
    <p>{description}</p>
  {/if}
  
  {#if audioKey && (audioKey == $audioPlayerStatus?.mediafileAudio?.meta?.key)}
    (playing)
  {:else}
    <button on:click={play}>play</button>
  {/if}
</section>