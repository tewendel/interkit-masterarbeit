<script>

  import { InterkitClient } from 'interkit'
  export let id;
  export let mediaManager = false;

  let mediafile;
  $: {
    lookupMediafile(id)
  }
  const lookupMediafile = async (id) => {
    mediafile = await InterkitClient.call("mediafile.get", id);
    console.log("loaded new mediafile for preview", mediafile)
  }

</script>

{#if mediafile?.isAudio}
  <a href="{mediafile.link}" target="_blank">{mediafile.name}</a> {#if !mediaManager}[change]{/if}
  {#key mediafile}
  <!--audio controls>
    <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
  </audio-->
  {/key}
{:else if mediafile?.isImage}
  <img class="preview-image" src={encodeURI(mediafile.link)}/>
{:else}
  no preview for this media type
{/if}



<style>

img.preview-image {
  max-height: 1.5rem;
}


</style>

