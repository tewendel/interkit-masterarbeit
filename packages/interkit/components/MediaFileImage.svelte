<script>

  import { onMount } from 'svelte'
  import { InterkitClient } from '../'
  
  export let mediafileRef; // {type: "mediafile", value: id}
  let projectId = INTERKIT_PROJECT_ID;
  
  //onMount(()=>{ console.log("mount", mediafileRef) })
  
  let mediafile;
  $: {
    lookupMediafile(mediafileRef?.value)
  }
  const lookupMediafile = async (key) => {
    if(key) {
      mediafile = await InterkitClient.call("mediafile.get", {key, projectId});
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

