<script>

  import { InterkitClient } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  //console.log(element)
  export let nameColumn;
  export let audioColumn;

  $: mediafileId = element.value[audioColumn.split("/")[1]].value
  $: title = element.value[nameColumn.split("/")[1]]
  
  const play = async () => {
    await playAudio(mediafileId, title)      
  }

</script>

<span>{title}</span>
{#if mediafileId && (mediafileId == $audioPlayerStatus?.mediafileId)}
  (playing)
{:else}
  <button on:click={play}>play</button>
{/if}