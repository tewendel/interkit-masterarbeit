<script>
  import { InterkitClient } from 'interkit'
  import ModelViewer from './ModelViewer.svelte'

  export let mediafile

</script>

{#if mediafile?.isAudio}
  <audio controls>
    <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
  </audio>
{:else if mediafile?.isVideo}
  <video controls>
    <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
  </video>
{:else if mediafile?.isImage}
  <img class="preview-image" src={encodeURI(mediafile.link)}/>
{:else if mediafile?.type.split("/")?.[0] === "model"}
  <ModelViewer mediafile={mediafile} />
{:else}
  {#if mediafile}
  no preview for this media type
  {/if}
{/if}



<style>

img, video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}



</style>

