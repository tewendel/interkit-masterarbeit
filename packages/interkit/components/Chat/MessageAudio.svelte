<script>
  import { setContext, onMount } from "svelte";
  import { writable } from 'svelte/store';

  import InlineAudioButton from '../InlineAudioButton.svelte';
  import PopoutAudioButton from '../PopoutAudioButton.svelte';

  export let message;
  export let userId;
  
  if (message?.payload?.options?.target === "popout") {
    const element = writable(message?.payload?.options?.element)
    setContext("element", element);
  }

</script>

<!--pre style="word-break: break-all; font-size: 10px; width: 80vw; white-space: pre-wrap">
{JSON.stringify(message?.payload)}
</pre>
<br/-->

{#if message?.payload?.options?.target === "popout"}

  <PopoutAudioButton
    audioColumn={message?.payload?.options?.audioColumn}
  />
{:else}
  <!-- TODO border-radiuses don't match -->
  <InlineAudioButton
    audioKeyDirect={message?.payload?.mediafileKey}
    autoplay={message?.payload?.options?.autoplay && !(message?.seen || []).includes($userId)}
  />
{/if}

<style>
  /* Add styles if needed */
</style>
