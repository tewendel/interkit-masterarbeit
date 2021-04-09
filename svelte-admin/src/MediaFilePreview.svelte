<script>

  import { InterkitClient } from 'interkit'
  export let id;

  let mediafile;
  $: {
    lookupMediafile(id)
  }
  const lookupMediafile = async (id) => {
    mediafile = await InterkitClient.call("mediafile.get", id);
    console.log("loaded new mediafile for preview", mediafile)
  }

</script>

select
{#if mediafile?.isAudio}
  {#key mediafile}
  <audio controls>
    <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
  </audio>
  {/key}
{:else}
  no preview for this media type
{/if}

