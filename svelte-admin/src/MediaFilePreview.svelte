<script>
  import '@google/model-viewer'

  import { InterkitClient } from 'interkit'
  export let key;
  export let projectId;
  export let mediaManager = false;

  let mediafile;
  $: {
    lookupMediafile(key)
  }
  const lookupMediafile = async (key) => {
    mediafile = await InterkitClient.call("mediafile.get", {key, projectId});
    //console.log("loaded new mediafile for preview", mediafile)
  }

</script>

{#if mediafile?.isAudio}
  {#key mediafile}
  <a href="{mediafile.link}" target="_blank">play</a> 
    {#if !mediaManager}[change]{/if}
  <!--audio controls>
    <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
  </audio-->
  {/key}
{:else if mediafile?.isVideo}
  {#key mediafile}
  <a href="{mediafile.link}" target="_blank">play</a> 
    {#if !mediaManager}[change]{/if}
  {/key}
{:else if mediafile?.isImage}
  <img class="preview-image" src={encodeURI(mediafile.link)}/>
{:else if mediafile?.type.split("/")?.[0] === "model"}
  {#if mediafile?.type.indexOf("model/gltf") === 0}
    <model-viewer auto-rotate autoplay style="height: 3em; width: 3em" src={mediafile.link}/>
  {:else}
    3d model without preview
  {/if}
{:else}
  {#if mediafile}
  no preview for this media type
  {/if}
{/if}



<style>

img.preview-image {
  max-height: 1.5rem;
}


</style>

