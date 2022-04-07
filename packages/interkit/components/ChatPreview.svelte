<script>

  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { InterkitClient } from "../"
  import { executeTrigger } from '../actions'

  import Message from './Chat/Message.svelte';

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let channel_key = "DEFAULT"
  export let selectTrigger

  let messageStore;
  let userId;

  onMount(async () => {

    userId = get(InterkitClient.userId);
    let sub = await InterkitClient.getSub("messages", "messages", {channel_key, userId})
    messageStore = sub.data

    console.log("userId", get(InterkitClient.userId))
  })

  let latestMessage

  $: {
    if ($messageStore) {
      $messageStore = $messageStore.sort((a, b) => b.createdAt - a.createdAt)
      latestMessage = $messageStore[0];
    }
  }

  const onClick = (element) => {
    if(selectTrigger)
      executeTrigger(selectTrigger)
  }

</script>


<div>
  {#if latestMessage}
    <Message message={latestMessage} preview/>
  {/if}

  {#if selectTrigger}
    <Button type="secondary" on:click={onClick}><Icon type="arrow-right"/></Button>
  {/if}

</div>