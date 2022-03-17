<script>

  export let message
  export let preview = false
  export let submitChoice = () => {}
  export let isByUser = false

</script>

{(preview && !message.origin) ? "You:" : ""}

{message?.payload?.options?.label ? message.payload.options.label + ":" : ""} 

<div
  class="message"
  class:message__user="{isByUser}"
  >
  <!--<time datetime={message?.createdAt}>{message?.createdAt}</time>-->
  {#if message?.payload?.type == "text"}  
    {message?.payload?.text}
  {/if}

  {#if message?.payload?.type == "choice"}
    {#if message?.payload?.choice}
      <ul>  
        {#each Object.keys(message?.payload?.choice) as key}
          <li class="choice-option" on:click={()=>{submitChoice(message, key)}}>
            {message.payload.choice[key]}
            {#if message?.selectedChoiceKey == key}(selected){/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>

  .message {
    border-radius: var(--border-radius);
    background: rgba(0, 0, 0, 0.1);
    padding: var(--distance-s);
    margin: var(--distance-m) 0;
    width: auto;
    align-self: flex-start;
  }

  .message__user {
    color: gray;
    text-align: right;
    align-self: flex-end;
  }

  .choice-option:hover {
    cursor: pointer;
  }

</style>
