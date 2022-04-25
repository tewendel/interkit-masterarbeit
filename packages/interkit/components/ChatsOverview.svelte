<script>

  import { onMount } from 'svelte'
  import ChatPreview from './ChatPreview.svelte'
  import { InterkitClient } from "../"

  export let selectTrigger;

  let channelsStore;

  onMount(async () => {
    // find out what chat channels exist
    console.log("getting channel sub")
    let channelsSubHandle = await InterkitClient.getSub("channels", "channels")
    channelsStore = channelsSubHandle.data;
  })

  /* TODO: sort channels by date of most recent message */


</script>


<h1>Chats</h1>

{#if $channelsStore}
  {#each $channelsStore as channel}
    <ChatPreview
      channel_key={channel.boardId}
      {selectTrigger}
    />
  {/each}
{/if}