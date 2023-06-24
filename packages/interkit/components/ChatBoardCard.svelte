<script>

  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient, util } from "../"
  
  import MessageIndicator from "./fragments/MessageIndicator.svelte";
  import StoryBoardImage from "./StoryBoardImage.svelte";
  import LinkConditional from "./LinkConditional.svelte";

  import Card from "./fragments/Card.svelte"

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

  const messagePreviewString = (_message) => {
    if(["text", "image", "video", "audio", "choice"].includes(_message?.payload?.type)) {
      let previewString = "";
      if(!_message.origin) previewString += "You:";
      if(_message?.payload?.type == "text") previewString += _message?.payload?.text
      if(_message?.payload?.type == "image") previewString += "[Image]";
      if(_message?.payload?.type == "video") previewString += "[Video]";
      if(_message?.payload?.type == "audio") previewString += "[Audio]";
      if(_message?.payload?.type == "choice") {
        for(let key in _message?.payload?.choice) {
          previewString += _message.payload.choice[key] + " "
        } 
      }
      return previewString;   
    }
  }

</script>

<LinkConditional to={path + "/" + real_channel_key}>
  <StoryBoardImage channel_key={real_channel_key} imageProvider let:imageRef={imageRef}>
    <Card
      variant="small"
      rightArrow
      headline={currentChannel?.title}
      label2={currentChannel?.label}
      subtitle2={messagePreviewString(latestMessage)}
      imageRef={imageRef}
      >
        <svelte:fragment slot="chips">
          {#if numUnseen}<MessageIndicator counter={numUnseen}/>{/if}
        </svelte:fragment>
    </Card>
  </StoryBoardImage>
</LinkConditional>
