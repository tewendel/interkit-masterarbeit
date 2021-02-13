<script>
  import InterkitClient from '../../shared/interkit-client.js'
  import { onMount } from 'svelte'

  let bundleServerURL
  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    console.log(`BUNDLER_URL: ${bundleServerURL}`)
  })

  export let projectId
  $: previewURL = projectId ? bundleServerURL + "/app/" + projectId : null

  const reloadPreview = () => {
    document.getElementById('app-preview').src = document.getElementById('app-preview').src
  }

  const compileProject = async () => {
    const res = await fetch(bundleServerURL + "/compile/" + projectId)
    console.log(res)
  }


</script>

<button on:click={compileProject}>compile project</button><br>
<button on:click={reloadPreview}>reload</button><br>
{#if bundleServerURL}
  <iframe id="app-preview" src={previewURL}></iframe><br>
{/if}
<a target="_blank" href="{previewURL}">link to app</a>


