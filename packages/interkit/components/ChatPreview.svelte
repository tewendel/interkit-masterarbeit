<script>

  import { onMount, getContext } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import { executeTrigger } from '../actions'

  import util from '../util.js';

  import MessagePreview from './Chat/MessagePreview.svelte';

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import MediaFileImage from "./MediaFileImage.svelte";
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte";

  export let channel_key = "DEFAULT"
  export let selectTrigger

  let real_channel_key = util.extractContextProp(channel_key);

  let channelsStore;
  let messageStore;
  let userId;

  onMount(async () => {

    let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
    channelsStore = channelsSubHandle.data;

    let sub = await InterkitClient.getMessageSub(real_channel_key);
    messageStore = sub.data

    console.log("userId", get(InterkitClient.userId))
  })

  let latestMessage  
  let currentChannel; 
  
  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => b.createdAt - a.createdAt)
      latestMessage = $messageStore[0];
    }
  }

  $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.boardId == channel_key)
      }
    }

  const onClick = (element) => {
    if(selectTrigger)
      executeTrigger(selectTrigger, real_channel_key)
  }

</script>

<div class="ChatPreview container" on:click={onClick}>
  <div class="ChatPreview__title title">
    {currentChannel?.title ? currentChannel?.title : "untitled (" + real_channel_key + ")"}
  </div>
  <div class="ChatPreview__image image">
    <ChatChannelImage channel_key={real_channel_key}/>
  </div>
  <div class="ChatPreview__message message">
    {#if currentChannel?.label}
      <span class="ChatPreview__label label">
        {currentChannel?.label}
      </span>  
    {/if}
    {#if latestMessage}
      <MessagePreview message={latestMessage} />
    {/if}
  </div>
</div>

<style>
  .container {
    font: var(--font-headline-4);
    letter-spacing: var(--letter-spacing-headline-4);
    cursor: pointer;
    display: grid;
    grid-template-columns: var(--distance-xxl) auto;
    grid-template-rows: auto auto;
    width: 100%;
    height: var(--distance-xxl);
    padding: 0 var(--distance-s);
    box-sizing: border-box;
  }

  .image {
    grid-row: 1 / span 2;
    grid-column: 1;
    padding: var(--distance-s);
    align-self: stretch;
  }

  .title {
    grid-row: 1;
    grid-column: 2;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    align-self: end;
  }

  .message {
    grid-row: 2;
    grid-column: 2;
    overflow: hidden;
    align-self: start;
  }


</style>