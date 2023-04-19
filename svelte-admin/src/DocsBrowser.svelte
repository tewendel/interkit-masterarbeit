<script>

  import { registerIframe } from './docs.js'

  import { onMount } from 'svelte'

  let iframe

  onMount(() => {
    registerIframe(iframe)
  })

  const localDocsURL = "http://localhost:3010"
  const remoteDocsURL = "https://docs.interkit.app"
  const docsURL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? localDocsURL : remoteDocsURL;

</script>

<!-- weird classname because svelte kept losing scope -->
<iframe
  class="ifr"
  title="interkit docs"
  src={docsURL}
  bind:this={iframe}
  ></iframe>

<style>

.ifr {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

</style>
