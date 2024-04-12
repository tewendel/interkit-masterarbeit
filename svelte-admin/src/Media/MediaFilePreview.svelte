<script>
  import { InterkitClient } from 'interkit'
  import ModelViewer from './ModelViewer.svelte'

  import MediaFilePreviewLarge from './MediaFilePreviewLarge.svelte'
  import { Modal, Button } from "carbon-components-svelte";
  import Music from "carbon-icons-svelte/lib/Music.svelte";
  import DocumentBlank from "carbon-icons-svelte/lib/DocumentBlank.svelte";

  export let key;
  export let id;
  export let projectId;
  export let mediaManager = false;
  export let enlargable = false;
  export let border = false;

  let mediafile, large;

  $: {
    lookupMediafile(key, id)
    if (large) { // reactivity through the back door
      large = mediafile;
    }
  }
  const lookupMediafile = async (key, id) => {
    mediafile = await InterkitClient.call("mediafile.get", {key, projectId});
    //console.log("loaded new mediafile for preview", mediafile)
  }

  const enlarge = (mediafile) => {
    if (!enlargable) return
    console.log("enlarge", mediafile);
    large = mediafile;
  }

</script>

<a title={mediafile?.name} class="frame" class:enlargable class:border href={mediafile?.link} on:click|preventDefault={() => enlarge(mediafile)} on:keypress={() => enlarge(mediafile)}>
  {#if mediafile?.isAudio}
    {#key mediafile}
      <span class="audio">
        <Music />
      </span>
    {/key}
  {:else if mediafile?.isVideo}
    {#key mediafile}
      <video>
        <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
      </video>
    {/key}
  {:else if mediafile?.isImage}
      <img class="preview-image" src={encodeURI(mediafile.link)}/>
  {:else if mediafile?.type.split("/")?.[0] === "model"}
      <ModelViewer mediafile={mediafile} small />
  {:else}
    {#if mediafile}
      <div class="centered" class:border>
        <DocumentBlank title={`Preview not available for ${mediafile?.type}`}/>
      </div>
    {/if}
  {/if}
</a>


<Modal passiveModal bind:open={large} modalHeading={large?.name} on:open on:close>
  {#if large}
    <MediaFilePreviewLarge mediafile={large} />
  {/if}
</Modal>

<style>

.frame {
  display: inline-flex;
  overflow: hidden;
  width: 3em;
  height: 3em;
}

.frame.enlargable {
  cursor: zoom-in;
}

.frame.border {
  outline: 1px solid #aaa;
}

.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

img.preview-image, video, .audio {
  width: 3em;
  height: 3em;
  object-fit: contain;
}

.audio {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
}

</style>

