<script>

  import { onMount, tick } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import Message from './Chat/Message.svelte';
  import ChatInput from './Chat/ChatInput.svelte';

  export let channel_key = "DEFAULT"

  let messageStore;
  let userId;

  onMount(async () => {

    // if a globalStore has been set, use that
    let channelKeyDynamic = InterkitClient.getGlobalStore("chatChannelKey");
    if(get(channelKeyDynamic)) {
      channel_key = get(channelKeyDynamic)
    }    

    console.log("getting sub with channel", channel_key)

    let sub = await InterkitClient.getMessageSub(channel_key);
    messageStore = sub.data

    userId = get(InterkitClient.userId)
    console.log("userId", userId)
  })

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => a.createdAt - b.createdAt)
      console.log("message update", $messageStore)
      scrollDown()
    }
  }

  let messagesScrollContainer

  const scrollDown = async () => {
    await tick()
    const top = messagesScrollContainer?.scrollHeight
    messagesScrollContainer?.scrollTo({ top: top, behavior: 'smooth' })
  }

  const sendMessage = (messageText) => {
    InterkitClient.call("message.send", {
      sender: userId,
      channel_key, 
      payload: {type: "text", text: messageText}
    })
  }

  const submitChoice = (message, selectedKey) => {
    if(!message?.selectedChoiceKey) {
      console.log("selected", selectedKey, message)
      InterkitClient.call("message.submitChoice", {
        sender: userId,
        channel_key, 
        messageId: message.id,
        selectedKey
      })
    }
  } 

</script>

<div class="root">
  <span>channel {channel_key}</span>
  <div
    class="messages-container"
    class:messages__empty={!messageStore || $messageStore.length === 0}
    bind:this={messagesScrollContainer}
    >
    {#if messageStore}
      <div class="messages">
        {#each $messageStore as message, index}
          <Message 
            {message} 
            {submitChoice} 
            isByUser={message?.sender === userId} 
            lastFromSender={message.sender !== $messageStore[index+1]?.sender || !$messageStore[index+1]}
            previousMessage={$messageStore[index-1]}
          />
        {/each}
      </div>
    {:else}
      Ø
    {/if}
  </div>
  <div class="input">
    <ChatInput on:submit={ event => sendMessage(event.detail.messageText)} />
  </div>
</div>

<style>

  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-background-highlight);
  }

  .messages-container {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .messages {
    display: flex;
    flex-direction: column;
    padding: var(--distance-m);
  }

  .input {
    flex-grow: 0;
    flex-shrink: 1;
  }

</style>
