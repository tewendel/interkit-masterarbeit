<script>
  import { onMount } from 'svelte'
  import Zoom from 'svelte-zoom'
  import { InterkitClient } from '../'
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import OverlayFull from './OverlayFull.svelte';

  export let mainClass = ''
  export let fitDimension = "width"; // "width", "height" or "both" is 100%
  export let objectFit = "cover"; // contain or cover
  export let mediafileRef; // {type: "mediafile", value: id}
  export let doFallback = false; // show replacement if mediafile not found
  export let style = null
  export let zoomable = false
  
  //onMount(()=>{ console.log("mount", mediafileRef) })

  let mediaFileStore;
  let mediafile;
  let zoomed = false;

  $: {
    if(mediaFileStore) lookupMediafile(mediafileRef, $mediaFileStore)
  }
  const lookupMediafile = async (ref, data) => {
    let key = ref?.value;
    if(key) {
      mediafile = await InterkitClient.getMediaFile(key);
    } else {
      mediafile = null;
    }
    // console.log("lookupMediafile", { ref, key, mediafile })
  }

  onMount(async () => {
    mediaFileStore = await InterkitClient.getMediaFileSubStore()
  })

  const showDummyData = getShowDummyDataStore()

  function encodeSvg(svgString) {
  return svgString.replace('<svg',(~svgString.indexOf('xmlns')?'<svg':'<svg xmlns="http://www.w3.org/2000/svg"'))
        .replace(/"/g, '\'')
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')       
        .replace(/{/g, '%7B')
        .replace(/}/g, '%7D')         
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/\s+/g,' ') 
  ;}
  const svgString = "<svg xmlns='http://www.w3.org/2000/svg' width='380' height='208' fill='none'><path fill='#FFDBD3' d='M0 0h380v208H0z'/></svg>"
  const dummyDataImgURL = "data:image/svg+xml, " + encodeSvg(svgString)
  
</script>

{#if mediafile || $showDummyData}
  <img
    on:click={() => { zoomed = true }}
    {style}
    class={`
      ${mainClass}
      MediaFileImage
      fitDimension-${fitDimension}
      MediaFileImage--fitdimension${fitDimension}
      objectFit-${objectFit}
      MediaFileImage--objectfit${objectFit}
    `}
    alt="mediafile"
    src={$showDummyData ? dummyDataImgURL : encodeURI(mediafile.link)}
    />
  {#if zoomable && zoomed}
    <OverlayFull closeMethod={()=>{zoomed = false}} customStyle="background-color: var(--color-background-mediafileimage-overlay);">
      <Zoom
        src={$showDummyData ? dummyDataImgURL : encodeURI(mediafile.link)}
        alt="mediafile"
      />
    </OverlayFull>
  {/if}
{:else if doFallback}
  <div class="MediaFileImage__Fallback {mainClass}__Fallback fallback">image not found</div>
{/if}

<style>
  img.objectFit-cover {
    object-fit: cover;
  }

  img.objectFit-contain {
    object-fit: contain;
  }

  img.fitDimension-width {
    width: 100%;
    max-height: 60vh;
  }

  img.fitDimension-height {
    height: 150px;
  }

  img.fitDimension-both {
    height: 100%;
    width: 100%;
  }

  .fallback {
    background: var(--color-background-backdrop);
    color: var(--color-text);
    padding:
      calc(var(--inset-y) * 3rem)
      calc(var(--inset-x) * 1rem);
    font-style: italic;
  }

  /* left for reference in case we need the safe-area-inset 
  .zoom-close-icon {
    position: absolute;
    z-index: 1;
    right: var(--distance-m);
    top: var(--distance-m);
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  
  }
  */

</style>

