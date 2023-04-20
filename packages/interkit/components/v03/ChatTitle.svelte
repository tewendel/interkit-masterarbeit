<script>

    import { onMount } from "svelte"
    import { get } from "svelte/store"
    import { InterkitClient } from "../"
    
    export let channel_key = "DEFAULT"
    
    let channelsStore;    
    onMount(async () => {      
        // if a globalStore has been set, use that
        let channelKeyDynamic = InterkitClient.getGlobalStore("chatChannelKey");
        if(get(channelKeyDynamic)) {
            channel_key = get(channelKeyDynamic)
        }

        console.log("onMount ChatTitle")
        let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
        channelsStore = channelsSubHandle.data;
    })
  
    let currentChannel 
    let title
  
    $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.channel_key == channel_key)
        //console.log("currentChannel ChatChannelImage", currentChannel)
        title = currentChannel?.title;
      }
    }
  
</script>
    
{#if title}
    <span>{title}</span>
{/if}
