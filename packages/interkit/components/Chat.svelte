<script>

  import { onMount } from "svelte"
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
    }
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

{#if messageStore}
  <ul>
    {#each $messageStore as message}
      <li class:userMessage="{message?.sender === userId}">
        <Message {message} {submitChoice}/>
      </li>
    {/each}
  </ul>
{/if}

<input type="text" bind:value={messageText} on:keydown={handleKeydown}/>
<Button on:click={submit}>send</Button>

<style>

  ul, li {
    width: 100%;
  }

  li.userMessage {
    color: gray;
    text-align: right;
  }

  ul {
    margin-bottom: 1em;
  }

</style>