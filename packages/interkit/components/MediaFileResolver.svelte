<script>

  import { onMount } from 'svelte'
  import { InterkitClient } from '../'
  
  export let mediafileRef; // {type: "mediafile", value: id}
  
  //onMount(()=>{ console.log("mount", mediafileRef) })

  let mediaFileStore;
  let mediafile;
  $: {
    if(mediaFileStore) lookupMediafile(mediafileRef, $mediaFileStore)
  }
  const lookupMediafile = async (ref, data) => {
    //console.log("lookupMediafile", ref)
    let key = ref?.value;
    if(key) {
      mediafile = await InterkitClient.getMediaFile(key);
    } else {
      mediafile = null;
    }
  }

  onMount(async () => {
    mediaFileStore = await InterkitClient.getMediaFileSubStore()
  })

</script>

{#if mediafile}
  <slot {mediafile} url={encodeURI(mediafile.link)}/>
{:else}
  file not found {JSON.stringify(mediafileRef)}
{/if}
