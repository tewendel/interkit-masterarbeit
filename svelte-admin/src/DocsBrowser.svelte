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
  >
</iframe>

<style>

.ifr {
  width: 100%;
  /* FIXME make 100% */
  min-height: 800px;
}

</style>
