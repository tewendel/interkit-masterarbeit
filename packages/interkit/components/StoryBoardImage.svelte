<script>

    import { onMount, getContext } from "svelte"
    import { InterkitClient } from "../"
    import { getShowDummyDataStore } from './dummyDataHelpers.js' 
    
    import MediaFileImage from "./MediaFileImage.svelte";
    import AspectRatio from "./AspectRatio.svelte"
  
    export let board
    export let channel_key = "DEFAULT"
    export let imageProvider = false // set this to true to use this just as a provider, passing the image into the slot
    export let topBarImage = false;
    export let classes;

    const boardContext = getContext("board")
    if(boardContext && !board) channel_key = $boardContext
    console.log("StoryBoardImage channel_key", channel_key)

    let channelsStore;    
    onMount(async () => {      
      console.log("onMount ChatChannelImage")
      let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
      channelsStore = channelsSubHandle.data;
    })
  
    let currentChannel 
    let channelImage;

    let showDummyData = getShowDummyDataStore()
  
    $: {
      if($channelsStore) {
        currentChannel = $channelsStore.find(c => c.channel_key == channel_key)
        //console.log("currentChannel ChatChannelImage", currentChannel)
        channelImage = currentChannel?.image;
      }
    }
  
</script>
    
{#if !imageProvider && (channelImage || $showDummyData)}
  <div
    class="StoryBoardImage _ChatChannelImage container {topBarImage ? "topBarImage" : ""} {classes}"
    class:StoryBoardImage--topbarimage={topBarImage}
    >
    <AspectRatio aspectRatioType="square">
      <MediaFileImage
        fitDimension="both"
        mediafileRef={channelImage}
        style="border-radius: var(--border-radius-button);"
        />
    </AspectRatio>
  </div>
{/if}

<slot imageRef={channelImage}/>

<style>
  .container.topBarImage {
    width: 2.5rem;
    height: 2.5rem;
  }
</style>
