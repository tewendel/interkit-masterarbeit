<script>

  import { getContext } from 'svelte'
  import { util } from "../"
  import MediaFileResolver from './MediaFileResolver.svelte';

  export let mediafileKey
  export let altText
  
  export let imageColumn
  export let altColumn
  
  export let width
  export let height
  export let customStyle = ''
  export let classes = ''
  
  const elementContext = getContext("element")
  if(!elementContext && !mediafileKey) {
    console.warn("Image needs an element context, for example from DataLoaderSingle")
  }

  let imageFileRef;
  $: {
    if(mediafileKey) imageFileRef = {value: mediafileKey}
    if(imageColumn) imageFileRef = util.rowVal($elementContext, imageColumn)
    if(altColumn) altText = util.rowVal($elementContext, altColumn)
  }
  
</script>

{#if imageFileRef}
  <MediaFileResolver let:url mediafileRef={imageFileRef} let:mediafile>
    <img
      {width}
      {height}
      style={
        customStyle +
        (mediafile?.meta?.fit?.backgroundColor
          ? `; background-color: ${mediafile.meta.fit.backgroundColor}; border-color: ${mediafile.meta.fit.backgroundColor}`
          : '')
      }
      src={url}
      alt={altText || mediafile?.meta?.alt}
      class={`
        ${classes}
        Image
        objectFit-${mediafile?.meta?.fit?.objectFit}
        Image--objectfit${mediafile?.meta?.fit?.objectFit}
      `}
      />
  </MediaFileResolver>
{/if}
    
<style>

  /* very non-DRY, repeated from MediaFileImage */

  img.objectFit-cover {
    object-fit: cover;
  }

  img.objectFit-contain {
    object-fit: contain;
  }

  img.objectFit-passepartout {
    object-fit: contain;
    box-sizing: border-box;
    background-color: var(--color-background-backdrop);
    border: var(--card-border-radius, var(--border-radius)) solid var(--color-background-backdrop);
  }
  
</style>
