<script>
  import { InterkitClient } from 'interkit'
  import ModelViewer from './ModelViewer.svelte'
  import MediaUpload from './MediaUpload.svelte'
  import { currentProjectReadOnly, projectId } from '../admin.js';

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

<pre>
Size: {mediafile.size} Bytes
Type: {mediafile.type}
Created At: {mediafile.meta.createdAt}
</pre>

{#if !$currentProjectReadOnly}
  <MediaUpload replaceMediafile={mediafile} projectId={$projectId}>  
    UPLOAD (Replace this file!)
  </MediaUpload>
{/if}

<style>

img, video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}



</style>

