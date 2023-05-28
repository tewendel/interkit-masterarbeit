<script>
  
  import { getContext } from 'svelte';
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Icon from './Icon.svelte'
  import { playAudio } from './AudioPlayer.svelte';

  export let audioColumn // the column that holds the audio we want to play

  // get the data row from the element context
  let element = getContext("element");
  console.log("PopoutAudioButton got element store from context", $element)
  if(!element) {
    console.warn("PopoutAudioButton needs an element context, for example from DataList")
  }
  
  // get the status of the global audio player
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")

  // calculate reactive states
  $: paused = $audioPlayerStatus?.paused
  $: loading = $audioPlayerStatus?.loading
  $: playing = $element && ($element.key == $audioPlayerElement?.key) && $audioPlayerStatus?.active

  const play = () => {
    console.log("AudioButon play", util.rowVal($element, audioColumn))
    playAudio($element, audioColumn)
  }

</script>

{#if loading && playing}
  <Loading/>
{:else}
  <Button on:click={play}>
    {#if playing}
      <Icon height="1em" type={ paused ? "play" : "pause"} />
    {:else}
      <Icon height="1em" type="play" />
      &thinsp;
    {/if}
  </Button>
{/if}
