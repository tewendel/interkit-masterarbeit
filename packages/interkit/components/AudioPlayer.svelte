<script context="module">
  import { InterkitClient } from '../'
  let projectId = INTERKIT_PROJECT_ID
  export const playAudio = async (key, title, autoplay=true) => {
    let mediafile = await InterkitClient.call("mediafile.get", {key, projectId})
    console.log(mediafile)
    audioPlayerStatus.set({
      mediafileKey: mediafile.meta.key,
      src: mediafile.link,
      title,
      autoplay
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

<div class="audioplayer-container">

  <div>{$audioPlayerStatus.title}</div>

  {#key $audioPlayerStatus}
    <audio controls autoplay={$audioPlayerStatus.autoplay}>
      <source src={encodeURI($audioPlayerStatus.src)} type="audio/mpeg">
    </audio>
  {/key}

  <button on:click={closePlayer}>close</button>

</div>

{/if}

<style>

  .audioplayer-container {
    background-color: white;
    padding: 5px;
    position: relative;
  }

</style>