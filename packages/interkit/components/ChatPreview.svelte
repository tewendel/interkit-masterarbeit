<script>

  import { onMount, getContext } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import { executeTrigger } from '../actions'

  import util from '../util.js';

  import Message from './Chat/Message.svelte';

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import MediaFileImage from "./MediaFileImage.svelte";
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte";

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


<div>
  <div class="preview-image">
    <div>{real_channel_key}</div>
    <ChatChannelImage channel_key={real_channel_key}/>
  </div>

  {#if latestMessage}
    <Message message={latestMessage} preview/>
  {/if}

  {#if selectTrigger}
    <Button type="secondary" on:click={onClick}><Icon type="arrow-right"/></Button>
  {/if}

</div>

<style>
  .preview-image {
    width: 200px;
  }

</style>