<script>

  import { InterkitClient, util } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  import { playAudio } from './AudioPlayer.svelte'

  export let element;
  //console.log(element)
  export let nameColumn;
  export let audioColumn;

  $: mediafileKey = util.rowVal(element, audioColumn)?.value
  $: title = util.rowVal(element, nameColumn)
  
  const play = async () => {
    await playAudio(mediafileKey, title)      
  }

</script>

<section class="ContentElementAudio container">

  <h3 class="ContentElementAudio__Headline headline">{title}</h3>

  <div class="ContentElementAudio__Controls">
    {#if mediafileKey && (mediafileKey == $audioPlayerStatus?.mediafileKey)}
      (playing)
    {:else}
      <button on:click={play}>play</button>
    {/if}
  </div>

</section>

<style>

</style>