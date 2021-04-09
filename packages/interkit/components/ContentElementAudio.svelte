<script>

  import { InterkitClient } from '../'
  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  export let element;
  console.log(element)
  export let nameColumn;
  export let audioColumn;

  let mediafileId;
  let title = element.value[nameColumn.split("/")[1]]
  
  const playAudio = async () => {
    mediafileId = element.value[audioColumn.split("/")[1]].value;
    let mediafile = await InterkitClient.call("mediafile.get", mediafileId)
    console.log(mediafile)
    audioPlayerStatus.set({
      mediafileId, 
      src: mediafile.link,
      title
    })
  }

</script>

<span>{title}</span>
{#if !$audioPlayerStatus?.mediafileId || mediafileId !== $audioPlayerStatus?.mediafileId}
  <button on:click={playAudio}>play</button>
{:else}
  (playing)
{/if}