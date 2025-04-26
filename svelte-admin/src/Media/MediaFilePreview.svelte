<script>
  import { InterkitClient } from 'interkit'
  import ModelViewer from './ModelViewer.svelte'
  import { onMount } from 'svelte';

  import MediaFilePreviewLarge from './MediaFilePreviewLarge.svelte'
  import Music from "carbon-icons-svelte/lib/Music.svelte";
  import DocumentBlank from "carbon-icons-svelte/lib/DocumentBlank.svelte";

  export let key;
  export let id;
  export let projectId;
  export let mediaManager = false;
  export let enlargable = false;
  export let border = false;

  let mediafile, large;
  let previewContainer;
  let bodyElement;

  onMount(() => {
    // Get reference to document body for portal usage
    bodyElement = document.body;
    return () => {
      // Clean up if needed
      if (large) large = false;
    };
  });

  $: {
    lookupMediafile(key, id)
    /*if (large) { // reactivity through the back door
      large = mediafile;
    }*/
  }

  const lookupMediafile = async (key, id) => {
    mediafile = await InterkitClient.call("mediafile.get", {key, projectId});
    //console.log("loaded new mediafile for preview", mediafile)
  }

  const enlarge = (mediafile) => {
    if (!enlargable) return
    console.log("enlarge", mediafile);
    large = true;
  }

  const closePreview = () => {
    large = false;
  }
</script>

<a title={mediafile?.name} class="frame" class:enlargable class:border href={mediafile?.link} on:click|preventDefault={() => enlarge(mediafile)} on:keypress={() => enlarge(mediafile)}>
  {#if mediafile?.isAudio}
    <span class="audio">
      <Music />
    </span>
  {:else if mediafile?.isVideo}
    <video>
        <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
    </video>
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

<!-- Portal-like approach - create a custom overlay that sits on top of everything -->
{#if large && mediafile && bodyElement}
  <div 
    class="fullscreen-overlay" 
    on:click|self={closePreview}
    on:keydown={e => e.key === 'Escape' && closePreview()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="preview-title"
  >
    <div class="preview-modal">
      <div class="preview-header">
        <h2 id="preview-title">{mediafile?.name}</h2>
        <!-- Replace Button with a simple button element to avoid Carbon component errors -->
        <button 
          class="close-btn" 
          on:click={closePreview}
          aria-label="Close preview">
          ×
        </button>
      </div>
      <div class="preview-content">
        <MediaFilePreviewLarge {mediafile} />
      </div>
      <!-- Adding a visually hidden close button that can receive focus for keyboard accessibility -->
      <button 
        class="visually-hidden"
        on:click={closePreview}
        tabindex="0"
        aria-label="Close preview">
        Close
      </button>
    </div>
  </div>
{/if}

<style lang="scss">
// Define Carbon-inspired colors
$carbon-gray-100: #161616;
$carbon-background: #ffffff;
$carbon-border-subtle: #e0e0e0;
$carbon-layer-hover: #e5e5e5;
$carbon-spacing-02: 0.25rem;
$carbon-spacing-04: 1rem;
$carbon-spacing-05: 2rem;
$carbon-duration-fast-01: 70ms;
$carbon-standard-easing: cubic-bezier(0.2, 0, 0.38, 0.9);

.frame {
  display: inline-flex;
  overflow: hidden;
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

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($carbon-gray-100, 0.7);
  z-index: 9000; /* Higher than Carbon's modals */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $carbon-spacing-05;
}

.preview-modal {
  background: $carbon-background;
  border-radius: 4px;
  width: 90%;
  max-width: 1200px;
  height: 90%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $carbon-spacing-04;
  border-bottom: 1px solid $carbon-border-subtle;
  
  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 400;
  }
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: $carbon-spacing-04;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: $carbon-spacing-02;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color $carbon-duration-fast-01 $carbon-standard-easing;
  
  &:hover {
    background: $carbon-layer-hover;
  }
}
</style>
