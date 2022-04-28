<script>
    import { onMount } from 'svelte'
    import { InterkitClient } from 'interkit';

    import MediaFileSelect from './InputModals/MediaFileSelect.svelte';

    export let boardId;
    export let projectId;

    let value;
    let showImageSelectModal = false;
  
    const addChannelImageToBoard = () => {
        showImageSelectModal = true;
    }

    const channelImageSubmit = (data) => {
        console.log("new image value", value)
        InterkitClient.call('channel.setProperty', {projectId, boardId, property: "image", value});
    }

    let connected = InterkitClient.connected;
    let channelsStore;
    let channelsSubHandle

    const setupChannelSub = async () => {
        let channelsSubHandle = await InterkitClient.getSub("channels", "channels", {projectId})
        channelsStore = channelsSubHandle.data;
        console.log("setupChannelSub", $channelsStore)
    }

    $: {
        if($connected && !channelsSubHandle) {
            setupChannelSub();   
        }
    }
    
    let currentChannel;
    const updateChannel = (channels, _boardId) => {
        currentChannel = channels.find(c => c.boardId == _boardId)
        console.log("currentChannel", currentChannel)
        if(currentChannel?.image) {
            value = currentChannel.image;
        } else {
            value = undefined;
        }
    }

    $: {
        if($channelsStore) {
            updateChannel($channelsStore, boardId)
        }
    }

    const close = () => { showImageSelectModal = false};

    
</script>


<button
    on:click={addChannelImageToBoard}
>
    add image  
</button>


{#if showImageSelectModal}
  <MediaFileSelect
    {projectId}
    {close}
    submit={() => {channelImageSubmit(); close();}}
    bind:value={value}
  />
{/if}
