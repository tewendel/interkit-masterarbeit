<script context="module">
  import { InterkitClient } from '../'
  export const playAudio = async (mediafileId, title) => {
    let mediafile = await InterkitClient.call("mediafile.get", mediafileId)
    console.log(mediafile)
    audioPlayerStatus.set({
      mediafileId: mediafile._id, 
      src: mediafile.link,
      title
    })
  }

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
</script>

<script>
  const closePlayer = () => {
    audioPlayerStatus.set(null)
  }

</script>

{#if $audioPlayerStatus}

<div>{$audioPlayerStatus.title}</div>

{#key $audioPlayerStatus}
  <audio controls autoplay>
    <source src={encodeURI($audioPlayerStatus.src)} type="audio/mpeg">
  </audio>
{/key}

<button on:click={closePlayer}>close</button>

{/if}
