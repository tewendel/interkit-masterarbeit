<script>
    import { InterkitClient } from 'interkit';

    import MediaFileSelect from './InputModals/MediaFileSelect.svelte';
    import MediaFilePreview from './MediaFilePreview.svelte';
    
    export let channel_key;
    export let projectId;

    let value;
    let showImageSelectModal = false;
  
    const addChannelImageToBoard = () => {
        showImageSelectModal = true;
    }

    const channelImageSubmit = (data) => {
        console.log("new image value", value)
        InterkitClient.call('channel.setProperty', {projectId, channel_key, property: "image", value});
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
    const updateChannel = (channels, _channel_key) => {
        currentChannel = channels.find(c => c.channel_key == _channel_key)
        console.log("currentChannel", currentChannel)
        if(currentChannel?.image) {
            value = currentChannel.image;
        } else {
            value = undefined;
        }
    }

    $: {
        if($channelsStore) {
            updateChannel($channelsStore, channel_key)
        }
    }

    const close = () => { showImageSelectModal = false};

    const changeLabel = () => {
        let newLabel = prompt("Change label", currentChannel.label)
        if(typeof newLabel == "string") {
            InterkitClient.call('channel.setProperty', {projectId, channel_key, property: "label", value: newLabel});
        }
    }

    const changeTitle = () => {
        let newLabel = prompt("Change title", currentChannel.title)
        if(typeof newLabel == "string") {
            InterkitClient.call('channel.setProperty', {projectId, channel_key, property: "title", value: newLabel});
        }
    }

    
</script>

<div class="container">

{#if currentChannel}
    <span>Title: {currentChannel.title} <button
        on:click={changeTitle}
    >change</button>
    </span>
    <span>Label: {currentChannel.label} <button
        on:click={changeLabel}
    >change</button>
    </span>
    <span>Image: <MediaFilePreview {projectId} key={currentChannel.image.value}/> <button
        on:click={addChannelImageToBoard}
    >change</button>
    </span>
{/if}

</div>

{#if showImageSelectModal}
  <MediaFileSelect
    {projectId}
    {close}
    submit={() => {channelImageSubmit(); close();}}
    bind:value={value}
  />
{/if}


<style>
    .container {
        margin: 10px 0px 15px 0px;
    }
</style>
