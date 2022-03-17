<script>

  import { onMount, tick } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import Button from './Button.svelte'
  import Message from './Chat/Message.svelte';

  export let channel_key = "DEFAULT"

  let messageStore;
  let userId;

  onMount(async () => {

    userId = get(InterkitClient.userId);
    let sub = await InterkitClient.getSub("messages", "messages", {channel_key, userId})
    messageStore = sub.data

    console.log("userId", get(InterkitClient.userId))
  })

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => a.createdAt - b.createdAt)
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
    console.log("selected", selectedKey, message)
    InterkitClient.call("message.submitChoice", {
      messageId: message.id,
      selectedKey
    })
  } 

  let messageText
  const submit = () => {
    sendMessage(messageText)
    messageText = ""
  }

  const handleKeydown = (event)=>{
    if (event.which === 13) {
      submit();
    }
  }

</script>

<div class="root">
  <div
    class="messages-container"
    class:messages__empty={!messageStore || $messageStore.length === 0}
    bind:this={messagesScrollContainer}
    >
    {#if messageStore}
      <div class="messages">
        {#each $messageStore as message}
          <Message {message} {submitChoice} isByUser={message?.sender === userId} />
        {/each}
      </div>
    {:else}
      Ø
    {/if}
  </div>
  <div class="input">
    <input type="text" bind:value={messageText} on:keydown={handleKeydown}/>
    <Button on:click={submit}>send</Button>
  </div>
</div>

<style>

  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
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
