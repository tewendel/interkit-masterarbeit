<script>

  import { InterkitClient } from '../'
  let audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

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
