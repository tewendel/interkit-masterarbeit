<script>
  import { setContext, onMount } from "svelte";
  import { writable } from 'svelte/store';

  import InlineAudioButton from '../InlineAudioButton.svelte';
  import PopoutAudioButton from '../PopoutAudioButton.svelte';

  export let message;
  export let userId;
  export let sendTracingMessage = () => {};
  
  if (message?.payload?.options?.target === "popout") {
    const element = writable(message?.payload?.options?.element)
    setContext("element", element);
  }

  // tracing
  // map from {key, value} to {key, {text: value.text, sendMessage: () => sendTracingMessage(value.text)}}
  const tracingData = message?.payload?.options?.tracing
    ? Object.fromEntries(
        Object.entries(message?.payload?.options?.tracing).map(
          ([key, value]) => [key, { text: value.text, sendMessage: () => sendTracingMessage(value.text, {
            rowKey: message?.payload?.options?.element?.key,
            key: key
          }) }]
        )
      )
    : null

  console.log("MessageAudio tracing", message?.payload?.options?.tracing, tracingData)

</script>

{#if message?.payload?.options?.target === "popout"}

  <PopoutAudioButton
    audioColumn={message?.payload?.options?.audioColumn}
    autoplay={message?.payload?.options?.autoplay && !(message?.seen || []).includes($userId)}
    {tracingData}
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
