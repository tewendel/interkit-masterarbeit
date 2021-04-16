<script>

  import { InterkitClient } from 'interkit'
  export let key;
  export let projectId;
  export let mediaManager = false;

  let mediafile;
  $: {
    lookupMediafile(key)
  }
  const lookupMediafile = async (id) => {
    mediafile = await InterkitClient.call("mediafile.get", {key, projectId});
    console.log("loaded new mediafile for preview", mediafile)
  }

</script>

{#if mediafile?.isAudio}
  {#key mediafile}
  <a href="{mediafile.link}" target="_blank">{mediafile.name}</a> 
    {#if !mediaManager}[change]{/if}
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

