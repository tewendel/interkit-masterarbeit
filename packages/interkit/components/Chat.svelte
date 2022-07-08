<script>

  import { onMount, onDestroy, tick } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import Message from './Chat/Message.svelte'
  import MessageTyping from './Chat/MessageTyping.svelte'
  import ChatInput from './Chat/ChatInput.svelte'
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte"

  import { Plugins } from '@capacitor/core';
  const { Geolocation } = Plugins;

  export let channel_key = "DEFAULT"

  const reportsChannelKey = 'REPORTS'

  let sub;
  let messageStore;
  let userId;
  let userSub;
  let userStore;

  let typingQueuePointer

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

    scrollDown()
    // window.setTimeout(() => { scrollDown() }, 500)
  })

  onDestroy(async () => {
    /*
    // this creates problems on resubscription
    if(sub)
      await sub.sub.stop();
    */
  })

  let storeUpdates = 0

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => a.createdAt - b.createdAt)
      console.log("message update", storeUpdates) // $messageStore)
      if (storeUpdates === 0) {
        typingQueuePointer = $messageStore.length
      }
      storeUpdates++
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

  const scrollDown = async () => {
    const behavior = storeUpdates <= 1 ? 'instant' : 'smooth'
    console.log('scrollDown', { behavior })
    await tick()
    const top = messagesScrollContainer?.scrollHeight
    messagesScrollContainer?.scrollTo({ top, behavior })
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

  let typingShow = false
  const typingMaxDuration = 5
  const typingMinDurationTypeText = 1
  const typingDurationPerTextCharacter = 0.05
  const typingDefaultDurationType = {
    choice: 2,
    image: 3
  }

  const typingDuration = message => {
    if (message.payload && ('typingDuration' in message.payload)) {
      return message.payload.typingDuration
    }
    let duration
    switch (message?.payload?.type) {
      case 'text':
        duration = Math.max(
          typingMinDurationTypeText,
          (message.payload?.text?.length * typingDurationPerTextCharacter) || 0
        )
        break
      case 'choice':
      case 'image':
        duration = typingDefaultDurationType?.[message.payload.type] || 1
        break
      default:
        duration = 1
    }
    return Math.min(duration, typingMaxDuration)
  }

  const typingNext = () => {
    // console.log('typingNext')
    if (typingShow) {
      // console.log('typingNext bailing typingShow')
      return
    }
    if (storeUpdates === 0) {
      // console.log('typingNext bailing because first storeUpdate')
      return
    }
    if (typingQueuePointer >= $messageStore.length) {
      // console.log('typingNext bailing QP >= store.length')
      return
    }
    const currentMessage = $messageStore[typingQueuePointer]
    if (!currentMessage) {
      // console.warn('typingNext bailing because no currentMessage')
      return
    }
    if (currentMessage?.sender === userId) {
      // console.log('typingNext skipping because user message')
      typingQueuePointer++
      typingNext()
    }
    const duration = typingDuration(currentMessage)
    // console.log('typingNext starting timeout', duration, currentMessage)
    typingShow = true
    window.setTimeout(() => {
      typingShow = false
      typingQueuePointer++
      // console.log('typingNext done timeout', { typingQueuePointer })
      typingNext()
    }, duration * 1000)
  }

  $: if ($messageStore) typingNext()
  $: if (typingShow) scrollDown()

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
          {#if index < typingQueuePointer}
            <Message 
              {message} 
              {submitChoice} 
              {submitLocation}
              isByUser={message?.sender === userId} 
              lastFromSender={message.sender !== $messageStore[index+1]?.sender || !$messageStore[index+1]}
              previousMessage={$messageStore[index-1]}
              on:report={ event => sendReport(event.detail.message) }
              on:mounted={() => { scrollDown() }}
              />
          {/if}
        {/each}
        <MessageTyping show={typingShow} />
        {#if $userStore?.[0]?.blocked}
          <div class="blocked">
            Du bist geblockt, vielleicht weil du gegen die Community-Richtlinien verstoßen hast. Klicke oben auf das Fragezeichen um die Richtlinien einzusehen. Dort findest du auch Kontaktdaten.
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div
    class="input"
    style={`visibility: ${chatInterface.text && !$userStore?.[0]?.blocked ? 'visible' : 'hidden'}`}
    >
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
