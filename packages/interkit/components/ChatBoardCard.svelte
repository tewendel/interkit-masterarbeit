<script>

  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient, util } from "../"
  
  import MessagePreview from './Chat/MessagePreview.svelte';

  import AspectRatio from "./AspectRatio.svelte";
  import ChatChannelImage from "./Chat/ChatChannelImage.svelte";
  import LinkConditional from "./LinkConditional.svelte";

  export let board = "board1"
  let channel_key = board
  export let path

  let real_channel_key = util.extractContextProp(channel_key);
  
  let channelsStore;
  let messageStore;
  let userId;
  let numUnseen;

  let userProjectData = InterkitClient.userProjectDataStore

  // stores to keep track of unseenMessages to combine into a badge
  const unseenMessagesInfo = InterkitClient.getGlobalStore("unseenMessagesInfo")
  if(!get(unseenMessagesInfo)) unseenMessagesInfo.set({})
  const unseenMessagesBadge = InterkitClient.getGlobalStore("unseenMessagesBadge")

  onMount(async () => {

    userId = get(InterkitClient.userId);
    console.log("ChatBoardCard onMount found userId", userId)

    console.log("onMount ChatBoardCard")
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

      // update info for this channel and calculate badge for all listed channels
      unseenMessagesInfo.set({...get(unseenMessagesInfo), [real_channel_key]: numUnseen}) 
      let numUnseenAllChannels = 0;
      const info = get(unseenMessagesInfo)
      for(let channelKey in info) {
        if($userProjectData?.channelProperties?.[channelKey]?.unlisted != true) {
          numUnseenAllChannels += info[channelKey]
        }
      }
      unseenMessagesBadge.set(numUnseenAllChannels)
      console.log(real_channel_key, $unseenMessagesInfo, $unseenMessagesBadge)
      
    })
   
  })

  let latestMessage  
  let currentChannel; 
  
  $: {
    if ($messageStore) {
      //console.log("messageStore update", $messageStore)
      const sortedMessages = $messageStore.filter(m => ["text", "video", "audio", "image"].includes(m.payload.type)).sort((a, b) => b.createdAt - a.createdAt)
      //console.log("chatPreview sorted", sortedMessages)
      latestMessage = sortedMessages?.[0];
    }
  }

  $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.channel_key == real_channel_key)
        //console.log("currentChannel", currentChannel, real_channel_key)
      }
    }

  const onClick = (element) => {
    if(path) {
      alert("routing to " + path)
    }
  }

</script>

<LinkConditional to={path + "/" + real_channel_key}>
  <div class="ChatBoardCard container">
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
</LinkConditional>
  
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