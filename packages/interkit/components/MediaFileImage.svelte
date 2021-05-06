<script>

  import { onMount } from 'svelte'
  import { InterkitClient } from '../'
  
  export let fitDimension = "width"; // width or height is 100%
  export let objectFit = "cover"; // contain or cover
  export let mediafileRef; // {type: "mediafile", value: id}
  
  //onMount(()=>{ console.log("mount", mediafileRef) })
  
  let mediafile;
  $: {
    lookupMediafile(mediafileRef?.value)
  }
  const lookupMediafile = async (key) => {
    if(key) {
      mediafile = await InterkitClient.getMediaFile(key);
    } else {
      mediafile = null;
    }
  }

</script>

{#if mediafile}
  <img class={`fitDimension-${fitDimension} objectFit-${objectFit}`} alt="mediafile" src={encodeURI(mediafile.link)}/>
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
    width: 100%;
  }

</style>

