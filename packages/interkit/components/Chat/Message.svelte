<script>

  export let message
  export let preview = false
  export let submitChoice = () => {}
  export let isByUser = false

</script>

{(preview && !message.origin) ? "You:" : ""}

{message?.payload?.options?.label ? message.payload.options.label : ""} 

{#if message?.payload?.type == "text" || message?.payload?.type == "choice"}   
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
        <ul
          class:selected={message?.selectedChoiceKey}
        >  
          {#each Object.keys(message?.payload?.choice) as key}
            <li 
              class="choice-option" 
              on:click={()=>{submitChoice(message, key)}}
              class:selected={message?.selectedChoiceKey == key}
            >
              {message.payload.choice[key]}
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  </div>
{/if}

<style>

  .message {
    border-radius: var(--border-radius);
    background: rgba(0, 0, 0, 0.1);
    padding: var(--distance-s);
    margin: var(--distance-s) 0;
    width: auto;
    align-self: flex-start;
  }

  .message__user {
    color: gray;
    text-align: right;
    align-self: flex-end;
  }
  
  li.choice-option {
    padding: 5px;
    border-radius: 5px;    
  }

  li.choice-option:not(:last-child) {
    margin-bottom: 5px;
  }

  ul:not(.selected) .choice-optio:hover {
    cursor: pointer;
  }
  
  ul:not(.selected) li.choice-option {
    background-color: yellow;
  }

  li.choice-option.selected {
    background-color: gray;
  }


</style>
