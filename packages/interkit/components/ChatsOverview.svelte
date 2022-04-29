<script>

  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import ChatPreview from './ChatPreview.svelte'
  import { InterkitClient } from "../"

  export let selectTrigger;

  let channelsStore;
  let channelsSorted;
  let channelLastMessageStores;
  let userId;

  onMount(async () => {
    userId = get(InterkitClient.userId);
    // find out what chat channels exist
    console.log("getting channel sub")
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
      const messages = get(channelLastMessageStores[channel._id])
      if(messages.length) {
        let messagesSorted = messages.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
        return new Date(messagesSorted[0].createdAt)
      }
    }
    /*for(let channel of get(channelsStore)) {
      console.log("channel", channel.channel_key, get(channelLastMessageStores[channel._id]), getDate(channel))
    }*/

    // sort the channels by latest messages
    channelsSorted = [...get(channelsStore)].sort((a,b)=>getDate(b) - getDate(a))
  }

  // set up the message subscriptions for all the channels
  const setupLatestMessageSubs = async (channels) => {
    //console.log("setupLatestMessageSubs", channels)
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

{#if channelsSorted}
  {#each channelsSorted as channel}
    {#key channel}
      <ChatPreview
        channel_key={channel.channel_key}
        {selectTrigger}
      />
    {/key}
  {/each}
{/if}