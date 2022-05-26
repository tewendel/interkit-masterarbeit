<script>

  import { onMount, onDestroy, tick } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import Message from './Chat/Message.svelte';
  import ChatInput from './Chat/ChatInput.svelte';
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte";

  import { Plugins } from '@capacitor/core';
  const { Geolocation } = Plugins;

  export let channel_key = "DEFAULT"

  const reportsChannelKey = 'REPORTS'

  let sub;
  let messageStore;
  let userId;
  let userSub;
  let userStore;

  onMount(async () => {

    // if a globalStore has been set, use that
    let channelKeyDynamic = InterkitClient.getGlobalStore("chatChannelKey");
    if(get(channelKeyDynamic)) {
      channel_key = get(channelKeyDynamic)
    }    

    console.log("getting sub with channel", channel_key)

    sub = await InterkitClient.getMessageSub(channel_key);
    messageStore = sub.data

    userId = get(InterkitClient.userId)
    console.log("userId", userId)

    userSub = await InterkitClient.getSub('users', 'user')
    userStore = userSub.data

  })

  onDestroy(async () => {
    /*
    // this creates problems on resubscription
    if(sub)
      await sub.sub.stop();
    */
  })

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => a.createdAt - b.createdAt)
      // console.log("message update", $messageStore)
      scrollDown()
      
      // mark all in channel as seen
      InterkitClient.call("channel.seeAll", {userId, channel_key});
    }
  }

  // initialize chat interface and watch user data for changes
  const defaultChatInterface = {
    text: true
  }
  let chatInterface = defaultChatInterface;
  const updateChatInterface = (config) => {
    if(!config) {
      chatInterface = defaultChatInterface
    } else {
      chatInterface = config
    }
    console.log("chatInterface updated", chatInterface)
  }
  const userProjectData = InterkitClient.userProjectDataStore;
  $: {
    console.log("userProjectDataStore updated", $userProjectData)
    updateChatInterface($userProjectData?.boardState?.[channel_key]?.interfaceConfig)
  }

  let messagesScrollContainer

  let initialRender = true;

  const scrollDown = async () => {
    await tick()
    const top = messagesScrollContainer?.scrollHeight
    messagesScrollContainer?.scrollTo({ top: top, behavior: initialRender ? 'instant' : 'smooth' })
    if(initialRender) initialRender = false;
  }

  const sendMessage = (messageText) => {
    InterkitClient.call("message.send", {
      sender: userId,
      channel_key, 
      payload: {type: "text", text: messageText},
      origin: "user"
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
  
  const submitLocation = async (message, canceled = false) => {
    let location;
    let error;
    if(!canceled) {
      try {
        location = await Geolocation.getCurrentPosition();
      } 
      catch(e) {
        alert("Error obtaining geolocation. You may need to give the app permission.")
        error = e;
        return false;
      }
      console.log("sending location", location)
    }    
    InterkitClient.call("message.submitLocation", {
      sender: userId,
      channel_key, 
      messageId: message.id,
      location: location ? {lng: location.coords.longitude, lat: location.coords.latitude} : undefined,
      canceled
    })
    return true
  }

  const sendReport = async (message) => {
    const reportText = 'user reported message:\n\n' + JSON.stringify(message)
    // console.log('reporting', { reportText, reportsChannelKey, sender: userId })
    let ret = await InterkitClient.call("message.send", {
      sender: userId,
      channel_key: reportsChannelKey,
      payload: {
        type: "text",
        text: reportText
      },
      origin: "user"
    })
    // console.log('report call ret', ret)
  }

</script>

<div class="root">
  <div class="channel-info-overlay">
    <!--span>channel {channel_key}</span-->
    <ChatChannelImage channel_key={channel_key}/>
  </div>
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
            {submitLocation}
            isByUser={message?.sender === userId} 
            lastFromSender={message.sender !== $messageStore[index+1]?.sender || !$messageStore[index+1]}
            previousMessage={$messageStore[index-1]}
            on:report={ event => sendReport(event.detail.message) }
          />
        {/each}
        {#if $userStore?.[0]?.blocked}
          <div class="blocked">
            Du bist geblockt, vielleicht weil du gegen die Community-Richtlinien verstoßen hast. Klicke oben auf das Fragezeichen um die Richtlinien einzusehen. Dort findest du auch Kontaktdaten.
          </div>
        {/if}
      </div>
    {/if}
  </div>
  {#if chatInterface.text && !$userStore?.[0]?.blocked}
    <div class="input">
      <ChatInput on:submit={ event => sendMessage(event.detail.messageText)} />
    </div>
  {/if}
</div>

<style>

  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-background-highlight);
  }

  .channel-info-overlay {
    position: absolute;
    width: 96px;
    height: 96px;
    top: var(--distance-m);
    left: var(--distance-s);
    z-index: 1;
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
    padding: calc(96px + var(--distance-l) ) var(--distance-m) var(--distance-m) var(--distance-m);
  }

  .input {
    flex-grow: 0;
    flex-shrink: 1;
    border-top: 1px solid var(--color-border);
  }

</style>
