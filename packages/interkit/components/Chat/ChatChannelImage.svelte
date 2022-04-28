<script>

    import { onMount } from "svelte"
    import { InterkitClient } from "../../"
    
    import MediaFileImage from "../MediaFileImage.svelte";
  
    export let channel_key = "DEFAULT"
    
    let channelsStore;    
    onMount(async () => {      
      let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
      channelsStore = channelsSubHandle.data;
    })
  
    let currentChannel 
    let channelImage;
  
    $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.boardId == channel_key)
        console.log("currentChannel ChatChannelImage", currentChannel)
        channelImage = currentChannel?.image;
      }
    }
  
</script>
    
{#if channelImage}
    <MediaFileImage mediafileRef={channelImage}/>
{/if}
