<script>

  import { InterkitClient } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  export let element;
  console.log(element)
  export let nameColumn;
  export let audioColumn;

  $: mediafileId = element.value[audioColumn.split("/")[1]].value
  $: title = element.value[nameColumn.split("/")[1]]
  
  const playAudio = async () => {
    let mediafile = await InterkitClient.call("mediafile.get", mediafileId)
    console.log(mediafile)
    audioPlayerStatus.set({
      mediafileId: mediafile._id, 
      src: mediafile.link,
      title
    })
  }

</script>

<span>{title}</span>
{#if mediafileId && (mediafileId == $audioPlayerStatus?.mediafileId)}
  (playing)
{:else}
  <button on:click={playAudio}>play</button>
{/if}