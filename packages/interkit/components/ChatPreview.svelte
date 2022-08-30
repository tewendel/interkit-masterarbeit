<script>

  import { onMount, getContext } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import { executeTrigger } from '../actions'

  import util from '../util.js';

  import MessagePreview from './Chat/MessagePreview.svelte';

  import AspectRatio from "./AspectRatio.svelte";
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte";

  export let channel_key = "DEFAULT"
  export let selectTrigger

  let real_channel_key = util.extractContextProp(channel_key);
  
  let channelsStore;
  let messageStore;
  let userId;
  let numUnseen;

  onMount(async () => {

    userId = get(InterkitClient.userId);
    console.log("ChatPreview onMount found userId", userId)

    console.log("onMount ChatPreview")
    let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
    channelsStore = channelsSubHandle.data;

    const messageFilter = m => (m.channel_key == real_channel_key) 
    let sub = await InterkitClient.getSub("messages", "messages.last", {channel_key: real_channel_key, userId}, messageFilter)
    messageStore = sub.data

    const filterUnseen = (m) => { return (m.channel_key == real_channel_key && !(m?.seen?.includes(userId))) }
    let subUnseen = await InterkitClient.getSub("messages", "messages.unseen", {channel_key: real_channel_key, userId}, filterUnseen)
    subUnseen.data.subscribe(unseenMessages=>{
      //console.log("unseen", unseenMessages)
      numUnseen = unseenMessages.length;
    })
   
  })

  let latestMessage  
  let currentChannel; 
  
  $: {
    if ($messageStore) {
      //console.log("messageStore update", $messageStore)
      $messageStore = $messageStore.sort((a, b) => b.createdAt - a.createdAt)
      latestMessage = $messageStore[0];
    }
  }

  $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.channel_key == real_channel_key)
        //console.log("currentChannel", currentChannel, real_channel_key)
      }
    }

  const onClick = (element) => {
    if(selectTrigger)
      executeTrigger(selectTrigger, real_channel_key)
  }

</script>

<div class="ChatPreview container" on:click={onClick}>
  <div class="ChatPreview__top top">
    <span class="ChatPreview__title title">
      {currentChannel?.title ? currentChannel?.title : "untitled (" + real_channel_key + ")"}
    </span>
    {#if numUnseen}
      <span class="ChatPreview__unseen unseen">
        {numUnseen}
      </span>
    {/if}
  </div>
  <div class="ChatPreview__image image">
    <AspectRatio aspectRatioType="square">
      <ChatChannelImage channel_key={real_channel_key}/>
    </AspectRatio>
  </div>
  <div class="ChatPreview__message message">
    {#if currentChannel?.label}
      <span class="ChatPreview__message__label label">
        {currentChannel?.label}
      </span>  
    {/if}
    {#if latestMessage}
      <span class="ChatPreview__message__text text">
        <MessagePreview message={latestMessage} />
      </span>
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

  .top {
    grid-row: 1;
    grid-column: 2;
    align-self: end;
    display: flex;
    overflow: hidden;
  }

  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    align-self: center;
  }

  .unseen {
    font: var(--font-caption-bold);
    color: var(--color-background);
    background-color: var(--color-text);
    padding: var(--distance-tiny) var(--distance-s);
    align-self: center;
  }

  .message {
    grid-row: 2;
    grid-column: 2;
    overflow: hidden;
    align-self: start;
  }

  .message .label {
    font: var(--font-caption-bold);
    color: var(--color-background);
    background-color: var(--color-text);
    padding: var(--distance-tiny) var(--distance-s);
    float:left;
    margin-right: 0.5ex;
  }

  .message .text {
    top: var(--distance-tiny);
    position: relative;
  }


</style>