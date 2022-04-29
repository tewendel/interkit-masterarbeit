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
        currentChannel = $channelsStore.find(c => c.channel_key == channel_key)
        //console.log("currentChannel ChatChannelImage", currentChannel)
        channelImage = currentChannel?.image;
      }
    }
  
</script>
    
{#if channelImage}
  <div class="ChatChannelImage container">
    <MediaFileImage fitDimension="both" mediafileRef={channelImage}/>
  </div>
{/if}

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>