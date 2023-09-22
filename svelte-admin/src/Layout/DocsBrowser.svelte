<script>

  import { registerIframe, docsURL, docsGo } from '../docs.js'
  import { push } from 'svelte-spa-router';

  import { onMount } from 'svelte'

  let iframe

  onMount(() => {
    console.log("DocsBrowser remounting")
    registerIframe(iframe)
  })
  
  window.onmessage = function(e) {
    console.log("got message from iframe", e?.data)
    if(e?.data?.method == "open-template") {
      push('/template/' + e?.data?.slug)
    }
  }


</script>


<!-- how you would navigate the Docs from outside the iframe:
<button
  style="position: absolute; z-index: 2000"
  on:click={() => iframe.contentWindow.postMessage({ method: 'routerHistoryBack' }, '*')}>back</button>
-->
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
