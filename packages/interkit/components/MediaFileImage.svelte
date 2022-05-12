<script>

  import { onMount } from 'svelte'
  import { InterkitClient } from '../'
  
  export let fitDimension = "width"; // width or height is 100%
  export let objectFit = "cover"; // contain or cover
  export let mediafileRef; // {type: "mediafile", value: id}
  export let doFallback = false; // show replacement if mediafile not found
  
  //onMount(()=>{ console.log("mount", mediafileRef) })

  let mediaFileStore;
  let mediafile;
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

</script>

{#if mediafile}
  <img class={`fitDimension-${fitDimension} objectFit-${objectFit}`} alt="mediafile" src={encodeURI(mediafile.link)}/>
{:else if doFallback}
  <div class="fallback">image not found</div>
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
    height: 100%;
  }

  img.fitDimension-both {
    height: 100%;
    width: 100%;
  }

  .fallback {
    background: #808080;
    color: white;
    padding: var(--distance-xl) var(--distance-m);
    font-style: italic;
  }

</style>

