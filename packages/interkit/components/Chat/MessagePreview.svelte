<script>
  import { getShowDummyDataStore } from '../dummyDataHelpers.js' 

  export let message
  export let preview = false
  export let submitChoice = () => {}

  let showDummyData = getShowDummyDataStore()
  const dummyData = {
    payload: {
      type: "text",
      text: "message text"
    }
  }
  $: _message = $showDummyData ? dummyData : message
  
</script>

{#if ["text", "image", "video", "audio", "choice"].includes(_message?.payload?.type) }   
  <div 
    class="MessagePreview message message--{_message.payload.type}"
  >

    {(preview && !_message.origin) ? "You:" : ""}

    <!--{message?.payload?.options?.label ? message.payload.options.label + ": " : ""}--> 

      {#if _message?.payload?.type == "text"}  
        {_message?.payload?.text}
      {/if}

      {#if _message?.payload?.type == "image"}[Image]{/if}
      {#if _message?.payload?.type == "video"}[Video]{/if}
      {#if _message?.payload?.type == "audio"}[Audio]{/if}

      {#if _message?.payload?.type == "choice"}
        {#if _message?.payload?.choice}
          {#each Object.keys(_message?.payload?.choice) as key}
            {_message.payload.choice[key]}
          {/each}
        {/if}
      {/if}
  </div>
{/if}

<style>

  .message {
    font: var(--font-caption);
    height: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

</style>
