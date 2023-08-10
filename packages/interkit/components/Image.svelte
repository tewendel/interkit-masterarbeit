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
  export let customStyle
  export let classes
  
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
  <MediaFileResolver let:url mediafileRef={imageFileRef} >
    <img {width} {height} style={customStyle} src={url} alt={altText} class={classes}/>
  </MediaFileResolver>
{/if}
    
<style>
  
</style>