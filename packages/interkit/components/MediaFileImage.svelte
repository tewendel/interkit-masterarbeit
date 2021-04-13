<script>

  import { InterkitClient } from '../'
  export let mediafileRef; // {type: "mediafile", value: id}
  import { onMount } from 'svelte'

  //onMount(()=>{ console.log("mount", mediafileRef) })
  
  let mediafile;
  $: {
    lookupMediafile(mediafileRef.value)
  }
  const lookupMediafile = async (id) => {
    if(id) {
      mediafile = await InterkitClient.call("mediafile.get", id);
    }
  }

</script>

{#if mediafile}
  <img src={encodeURI(mediafile.link)}/>
{/if}

<style>

img {
  max-height: 100px;
}

</style>

