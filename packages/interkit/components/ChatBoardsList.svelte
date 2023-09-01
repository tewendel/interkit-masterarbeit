<script>

  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import ChatBoardCard from './ChatBoardCard.svelte'
  import { InterkitClient } from ".."
  import { getShowDummyDataStore } from './dummyDataHelpers.js' 

  import SectionShell from './SectionShell.svelte'

  export let path;

  let channelsStore;
  let channelsSorted;
  let channelOrder = {};
  let channelLastMessageStores;
  let userId;

  let userProjectData = InterkitClient.userProjectDataStore

  let showDummyData = getShowDummyDataStore()
  const dummyData = [...Array(5).keys()].map((k) => {return {channel_key: `${k}`}})

  onMount(async () => {
    userId = get(InterkitClient.userId);
    // find out what chat channels exist
    console.log("onMount ChatBoardsList")
    let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
    channelsStore = channelsSubHandle.data;
  })
  
  // sort the channels
  const sortChannels = () => {
    //console.log("sortChannels", get(channelsStore))
    //console.log("channelLastMessageStores", channelLastMessageStores)
    if(!channelLastMessageStores) return;
    
    // this finds the date of the latest message in the channel
    const getDate = (channel) => {
      if(!channel) return
      const messages = get(channelLastMessageStores[channel._id])
      if(messages?.length) {
        let messagesSorted = messages.filter(m => ["text", "audio", "video", "system"].includes(m.payload?.type)).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
        //console.log(channel.channel_key, messagesSorted?.[0]?.createdAt)
        return new Date(messagesSorted?.[0]?.createdAt)
      }
    }
    
    // sort the channels by latest messages
    channelsSorted = [...get(channelsStore)].sort((a,b)=>getDate(b) - getDate(a))

    if(channelsSorted) {
      // save the order
      for(let i = 0; i < channelsSorted.length; i++) {
        channelOrder[channelsSorted[i].channel_key] = i;
      }
      channelOrder = channelOrder;
    }
  }

  // set up the message subscriptions for all the channels
  const setupLatestMessageSubs = async (channels) => {
    console.log("setupLatestMessageSubs", channels)
    if(!channels) return;
    let newStores = {};
    if(channels) {
      for(let channel of channels) {
        const messageFilter = m => (m.channel_key == channel.channel_key) 
        const sub = await InterkitClient.getSub("messages", "messages.last", {channel_key: channel.channel_key, userId}, messageFilter)
        newStores[channel._id] = sub.data;
        // when any of these subscriptios updates, re-sort the channels
        newStores[channel._id].subscribe((data)=>{
          sortChannels();
        })
        
      }
    }    
    channelLastMessageStores = newStores;
    sortChannels();
  }

  // when we see new channels, update the message subs for each channel
  $: {
    setupLatestMessageSubs($channelsStore)
  }

</script>

<SectionShell classes="ChatBoardsList">
{#if $channelsStore || $showDummyData}
  {#each ($showDummyData ? dummyData : $channelsStore) as channel}
    {#if $showDummyData || $userProjectData?.channelProperties?.[channel.channel_key]?.unlisted != true}
      <div class="ChatBoardsList__SortItem sort-item" style="order: {channelOrder[channel.channel_key]}">
        <ChatBoardCard
          board={channel.channel_key}
          {path}
        />
      </div>
    {/if}
  {/each}
{/if}
</SectionShell>

<style>

  .sort-container {
    display: flex;
    flex-direction: column; 
  }

</style>
