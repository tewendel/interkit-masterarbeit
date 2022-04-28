<script>

  import { onMount, getContext } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import { executeTrigger } from '../actions'

  import util from '../util.js';

  import MessagePreview from './Chat/MessagePreview.svelte';

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let channel_key = "DEFAULT"
  export let selectTrigger

  let real_channel_key = util.extractContextProp(channel_key);

  let messageStore;
  let userId;

  onMount(async () => {

    let sub = await InterkitClient.getMessageSub(real_channel_key);
    messageStore = sub.data

    console.log("userId", get(InterkitClient.userId))
  })

  let latestMessage

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => b.createdAt - a.createdAt)
      latestMessage = $messageStore[0];
    }
  }

  const onClick = (element) => {
    if(selectTrigger)
      executeTrigger(selectTrigger, real_channel_key)
  }

</script>


<div class="ChatPreview container" on:click={onClick}>
  <div>{real_channel_key}</div>
  {#if latestMessage}
    <div class="latestMessage">
      <MessagePreview message={latestMessage} />
    </div>
  {/if}
</div>

<style>
  .container {
    font: var(--font-headline-4);
    letter-spacing: var(--letter-spacing-headline-4);
    cursor: pointer;
    padding: var(--distance-s);
  }

  .latestMessage {
    margin-top: var(--distance-tiny);
  }
</style>