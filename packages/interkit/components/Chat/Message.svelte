<script>

  export let message
  export let preview = false;
  export let submitChoice = () => {};

</script>

{(preview && !message.origin) ? "You:" : ""}

{message?.payload?.options?.label ? message.payload.options.label + ":" : ""} 

{#if message?.payload?.type == "text"}  
  {message?.payload?.text}
{/if}

{#if message?.payload?.type == "choice"}
  {#if message?.payload?.choice}
    <ul>  
      {#each Object.keys(message?.payload?.choice) as key}
        <li class="choice-option" on:click={()=>{submitChoice(message, key)}}>{message.payload.choice[key]}
        {#if message?.selectedChoiceKey == key}(selected){/if}
        </li>
      {/each}
    </ul>
  {/if}
{/if}


<style>
  .choice-option:hover {
    cursor: pointer;
  }
</style>