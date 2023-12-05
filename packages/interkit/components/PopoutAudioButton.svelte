<script>
  
  import { getContext } from 'svelte';
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Icon from './Icon.svelte'
  //import { playAudio } from './AudioPlayer.svelte';

  export let audioColumn // the column that holds the audio we want to play
  export let buttonOptions

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

  const play = async () => {
    console.log("AudioButon play", util.rowVal($element, audioColumn))
    //playAudio($element, audioColumn)
    await InterkitClient.playFloatingAudio($element, audioColumn)
  }

</script>

{#if loading && playing}
  <Loading mainClass="PopoutAudioButton" />
{:else}
  <Button {buttonOptions} on:click={play} mainClass="PopoutAudioButton">
    {#if playing}
      <Icon inverse={buttonOptions?.type == "primary"} type={ paused ? "Thin-Play" : "Thin-Pause"} />
    {:else}
      <Icon inverse={buttonOptions?.type == "primary"} type="Thin-Play" />
      &thinsp;
    {/if}
  </Button>
{/if}
