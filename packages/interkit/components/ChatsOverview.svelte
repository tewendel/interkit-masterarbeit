<script>

  import { onMount } from 'svelte'
  import ChatPreview from './ChatPreview.svelte'
  import { InterkitClient } from "../"

  export let selectTrigger;

  let channelsStore;
  let channelsSorted;

  onMount(async () => {
    // find out what chat channels exist
    console.log("getting channel sub")
    let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
    channelsStore = channelsSubHandle.data;
  })

  $: {
    if($channelsStore) {
      channelsSorted = $channelsStore.sort((a,b)=>{return (b?.lastMessageSent - a?.lastMessageSent)})
      console.log("channelsSorted", channelsSorted)
    }
  }

  /* TODO: sort channels by date of most recent message */


</script>

{#if channelsSorted}
  {#each channelsSorted as channel}
    {#key channel}
      <ChatPreview
        channel_key={channel.boardId}
        {selectTrigger}
      />
    {/key}
  {/each}
{/if}