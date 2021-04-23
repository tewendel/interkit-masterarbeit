<script>

  import { InterkitClient, util } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  import MediaFileImage from './MediaFileImage.svelte'

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  
  export let nameColumn;
  export let audioColumn;

  export let descriptionColumn;
  export let imageColumn;


  $: mediafileKey = util.rowVal(element, audioColumn)?.value
  $: title = util.rowVal(element, nameColumn)
  $: description = util.rowVal(element, descriptionColumn)

  const play = async () => {
    await playAudio(mediafileKey, title)      
  }

</script>

<MediaFileImage mediafileRef={util.rowVal(element, imageColumn)} />    
<span>{title}</span>
<div>{description}</div>
{#if mediafileKey && (mediafileKey == $audioPlayerStatus?.mediafileKey)}
  (playing)
{:else}
  <button on:click={play}>play</button>
{/if}