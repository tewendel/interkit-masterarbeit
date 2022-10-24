<script>

  import { onMount, onDestroy, tick, beforeUpdate, afterUpdate } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import Message from './Chat/Message.svelte'
  import MessageTyping from './Chat/MessageTyping.svelte'
  import ChatInput from './Chat/ChatInput.svelte'
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte"

  import { Plugins } from '@capacitor/core';
  import { decimalToSexagesimal } from "geolib";

  const verbose = false

  const projectDataStore = InterkitClient.userProjectDataStore

  const { Geolocation } = Plugins;

  export let channel_key = "DEFAULT"
  export let messagesReportableDefault = 'TRUE'

  // limited by typingMaxDuration!
  export let typingDurationTypeChoiceDefault = '0'
  typingDurationTypeChoiceDefault = (+typingDurationTypeChoiceDefault) || 0

  // limited by typingDurationTypeTextMin!
  export let typingDurationTypeTextPerCharacter = '0.075'
  typingDurationTypeTextPerCharacter = (+typingDurationTypeTextPerCharacter) || 0.075

  // comma-separated string of message types, for which to hide typing dots. e.g. text,choice
  export let typingHideTypes = ''
  typingHideTypes = typingHideTypes.split(',').map(_ => _.trim())

  const reportsChannelKey = 'REPORTS'

  let sub;
  let messageStore;
  let userId;
  let userSub;
  let userStore;
  let projectId;

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
    console.log("Chat userId", userId)
    projectId = get(InterkitClient.projectId)
    console.log("Chat projectId", projectId)

    userSub = await InterkitClient.getSub('users', 'user')
    userStore = userSub.data

    // scrollDown()
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
      //scrollDown()
      
      // mark all in channel as seen
      // setTimeout required for autoplay of unseen messages
      setTimeout(()=>{
          InterkitClient.call("channel.seeAll", {userId, channel_key});
        },
        2000
      )
      
    }
  }

  $: showInputField = (chatInterface?.text || chatInterface?.photo) && !$userStore?.[0]?.blocked

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
  const autoscrollOffsetPx = 40

  const getScrollOffset = () => {
    if(!messagesScrollContainer) return 0;
    const {scrollHeight, scrollTop, clientHeight} = messagesScrollContainer
    const offset = scrollHeight - scrollTop - clientHeight
    return offset;
  }

  let doAutoScroll = false;

  beforeUpdate(() => {
    const offset = getScrollOffset();
    console.log("beforeUpdate", offset)
    doAutoScroll = offset < autoscrollOffsetPx;
  });

  afterUpdate(() => {
    console.log("afterUpdate", getScrollOffset())
    scrollDown();
  });
 
  const scrollDown = async () => {

    if(doAutoScroll) {
      const behavior = storeUpdates <= 1 ? 'instant' : 'smooth'
      //console.log('scrollDown', { behavior })
      await tick()
      
      const top = messagesScrollContainer?.scrollHeight
      messagesScrollContainer?.scrollTo({ top, behavior })
    }
  }

  const sendMessage = (messageText) => {
    InterkitClient.call("message.send", {
      sender: userId,
      channel_key, 
      payload: {type: "text", text: messageText},
      origin: "user"
    })
  }

  const sendImage = (imageKey) => {
    InterkitClient.call("message.send", {
      sender: userId,
      channel_key, 
      payload: {type: "image", mediafileKey: imageKey},
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
    await InterkitClient.call("message.submitLocation", {
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
  let typingMessage;
  let typingMaxDuration
  $: typingMaxDuration = $projectDataStore?.userVars?.debugTurboMode ? 2 : 15
  const typingDurationTypeTextMin = 1

  const getTypingDuration = message => {
    if (message.payload && ('typingDuration' in message.payload)) {
      return message.payload.typingDuration
    }
    if (message.payload?.options && ('typingDuration' in message.payload.options)) {
      return message.payload.options.typingDuration
    }
    let duration
    switch (message?.payload?.type) {
      case 'text':
        duration = Math.max(
          typingDurationTypeTextMin,
          (message.payload?.text?.length * typingDurationTypeTextPerCharacter) || 0
        )
        break
      case 'choice':
        duration = typingDurationTypeChoiceDefault
        break
      case 'image':
        duration = 3
        break
      case 'system':
        duration = 0
        break
      default:
        duration = 1
    }
    return Math.min(duration, typingMaxDuration)
  }

  const typingNext = () => {
    if (verbose) console.log('typingNext')
    if (typingShow) {
      if (verbose) console.log('typingNext bailing typingShow')
      return
    }
    if (storeUpdates === 0) {
      if (verbose) console.log('typingNext bailing because first storeUpdate')
      return
    }
    if (typingQueuePointer >= $messageStore.length) {
      if (verbose) console.log('typingNext bailing QP >= store.length')
      return
    }
    const currentMessage = $messageStore[typingQueuePointer]
    if (!currentMessage) {
      if (verbose) console.warn('typingNext bailing because no currentMessage')
      return
    }
    if (currentMessage?.sender === userId) {
      if (verbose) console.log('typingNext skipping because user message')
      typingQueuePointer++
      setTimeout(typingNext, Math.floor(Math.random() * 500) +  750) // first reply
      return
    }
    const duration = getTypingDuration(currentMessage)
    typingShow = !typingHideTypes.includes(currentMessage?.payload?.type)
    if (verbose) console.log('typingNext starting timeout', duration, currentMessage, typingShow)
    typingMessage = currentMessage;
    window.setTimeout(() => {
      const interfaceConfig = typingMessage?.payload?.options?.setInterface
      if (interfaceConfig) {
        console.log('Chat message has setInterface, calling…', typingMessage, interfaceConfig)
        InterkitClient.call('user.setBoardInterface', { userId, projectId, boardId: channel_key, interfaceConfig })
      }
      typingShow = false
      typingQueuePointer++
      if (verbose) console.log('typingNext done timeout', { typingQueuePointer })
      setTimeout(typingNext, Math.floor(Math.random() * 500) +  750) // following supplies
    }, duration * 1000)
  }

  $: if ($messageStore) typingNext()
  //$: if (typingShow) scrollDown()

</script>

<div class="Chat root">
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
              isReportable={message?.payload?.options?.reportable !== undefined
                ? message?.payload?.options?.reportable
                : (messagesReportableDefault === 'TRUE')
              }
              on:report={ event => sendReport(event.detail.message) }
              on:mounted={() => { /*scrollDown()*/ }}
              />
          {/if}
        {/each}
        <MessageTyping show={typingShow} message={typingMessage} />
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
    class:hidden={!showInputField}
    >
    <ChatInput 
      {chatInterface} 
      userId={userId}
      boardId={channel_key}
      nodeId={channel_key ? $userProjectData?.boardState?.[channel_key]?.nodeId : undefined}
      on:submit={ event => sendMessage(event.detail.messageText)} 
      on:imageSubmit={ event => sendImage(event.detail.imageKey) }
    />
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

  .input.hidden {
    visibility: hidden;
  }

</style>
