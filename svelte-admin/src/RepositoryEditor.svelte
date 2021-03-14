<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'

  export let projectId

  let bundleServerURL

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
  })

</script>

{projectId}
<iframe src="{bundleServerURL}/fs/fs/{projectId}">
</iframe>

<style>
  iframe {
    width: 100%;
    height: 80vh;
  }
</style>