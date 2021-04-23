<script>

  import { onMount } from 'svelte';

  import { InterkitClient, util } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  import MediaFileImage from './MediaFileImage.svelte'

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  
  export let nameColumn;
  export let audioColumn;

  export let descriptionColumn;
  export let imageColumn;

  export let categoryRefColumn; // the column on the element referencing the category
  export let categoryOrderColumn; // the column on the element with the order for this category
  export let categoryTitleColumn; // the column on the category with the title
  export let categorySubtitleColumn; // the column on the category with the subtitle

  console.log(categoryRefColumn, categoryOrderColumn, categoryTitleColumn, categorySubtitleColumn)

  let projectId = INTERKIT_PROJECT_ID

  $: mediafileKey = util.rowVal(element, audioColumn)?.value
  $: title = util.rowVal(element, nameColumn)
  $: description = util.rowVal(element, descriptionColumn)
  $: categoryIndex = util.rowVal(element, categoryOrderColumn)

  let categoryRow; // the row of the category that is referenced in this element

  onMount(async () => {
    let categoryRowKey = util.rowVal(element, categoryRefColumn)?.rowKeys?.[0]
    if(categoryRowKey)
      categoryRow = await InterkitClient.call("row.get", {projectId, key: categoryRowKey});
    console.log(categoryRow)
  })

  const play = async () => {
    await playAudio(mediafileKey, title)      
  }

</script>

<section class="ContentElementAudio">
  <MediaFileImage mediafileRef={util.rowVal(element, imageColumn)} />    
  <h3>{title} <span>{categoryIndex}</span>
<span>{util.rowVal(categoryRow, categoryTitleColumn)}</span>
<span>{util.rowVal(categoryRow, categorySubtitleColumn)}</span>
</h3>
  <p>{description}</p>
  {#if mediafileKey && (mediafileKey == $audioPlayerStatus?.mediafileKey)}
    (playing)
  {:else}
    <button on:click={play}>play</button>
  {/if}
</section>