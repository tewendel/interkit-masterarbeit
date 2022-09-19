<script>
  import MessageDate from "./MessageDate.svelte";
  import Button from "../Button.svelte";

  export let message
  export let preview = false
  export let submitChoice = () => {}

</script>

{#if message?.payload?.type == "text" || message?.payload?.type == "choice"}   
  <div 
    class="MessagePreview message message--{message.payload.type}"
  >

    {(preview && !message.origin) ? "You:" : ""}

    <!--{message?.payload?.options?.label ? message.payload.options.label + ": " : ""}--> 

      {#if message?.payload?.type == "text"}  
        {message?.payload?.text}
      {/if}

      {#if message?.payload?.type == "choice"}
        {#if message?.payload?.choice}
          {#each Object.keys(message?.payload?.choice) as key}
            {message.payload.choice[key]}
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
