<script>

  import { registerIframe, docsURL } from './docs.js'

  import { onMount } from 'svelte'

  let iframe

  onMount(() => {
    registerIframe(iframe)
  })

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
