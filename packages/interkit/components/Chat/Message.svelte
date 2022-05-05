<script>
  import { createEventDispatcher } from 'svelte';

  import MessageDate from "./MessageDate.svelte";
  import Button from "../Button.svelte";
  import Icon from "../Icon.svelte";

  const dispatch = createEventDispatcher();

  export let message
  export let preview = false
  export let submitChoice = () => {}
  export let isByUser = false
  export let lastFromSender = false
  export let previousMessage = null

  let showOptions = false

  const startMessageOptionDialog = () => {
    if (window.confirm('Möchtest du diese Nachricht oder diesen Benutzer wegen unangemessener Inhalte an das Moderationsteam melden? Wir kümmern uns innerhalb von 24 Stunden darum.') === true) {
      report()
    }
    showOptions = false
  }

  const report = () => {
    dispatch('report', { message })
  }

</script>

{#if message?.payload?.options?.label}
<span class="message-label">{message?.payload?.options?.label}</span> 
{/if}

{#if message?.payload?.type == "text" || message?.payload?.type == "choice"}   
  <div 
    class="message  message--{message.payload.type}"
    class:message__user="{isByUser}"
    class:message__lastFromSender={lastFromSender}
  >
    <div
        class="message__bubble"
        on:click={() => { if (message?.payload?.type !== 'choice') showOptions = true }}
      >
      <!--<time datetime={message?.createdAt}>{message?.createdAt}</time>-->
      {#if message?.payload?.type == "text"}  
        {message?.payload?.text}
      {/if}

      {#if message?.payload?.type == "choice"}
        {#if message?.payload?.choice}
          <ul
            class="message__choices"
            class:selected={message?.selectedChoiceKey}
          >  
            {#each Object.keys(message?.payload?.choice) as key}
              <li 
                class="choice-option" 
              >
                <Button
                  on:click={()=>{submitChoice(message, key)}}
                  selected={message?.selectedChoiceKey == key}
                  flex="fill"
                >
                  {message.payload.choice[key]}
                </Button>
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </div>
    <MessageDate {message} {previousMessage} {lastFromSender} />
    {#if showOptions}
      <div
        class="message__options"
        on:click={() => { startMessageOptionDialog() }}
        >
        <Icon type="Full-Warning" height="1.2em" />
        Inhalte melden
      </div>
    {/if}
  </div>
{/if}

<style>

  .message {
    width: auto;
    max-width: 80%;
    align-self: flex-start;
    font: var(--font-body-1);
    position: relative;
    margin-bottom: var(--distance-s);
  }

  .message-label {
    font: var(--font-caption-bold);
    margin-bottom: var(--distance-xs);
  }

  .message__bubble {
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    border-width: var(--border-width);
    border-color: var(--color-border);
    border-style: solid;
    padding: var(--distance-s);
    font: var(--font-body-1);
    position: relative;
  }

  .message--choice, .message__user {
    text-align: right;
    align-self: flex-end;
  }

  .message:not(.message__user):not(.message--choice) .message__bubble {
    border-bottom-left-radius: 0;
  }

  .message__user .message__bubble {
    border-bottom-right-radius: 0;
  }

  .message.message__lastFromSender .message__bubble {
    margin-bottom: var(--distance-m);
  }

  /* css triangle */
  .message:not(.message--choice).message__lastFromSender .message__bubble::after {
    content: "";
    position: absolute;
    bottom: -10px;
    width: 0;
    height: 0;
  }

  /* attach css triangle */
  .message:not(.message__user) .message__bubble::after {
    left: calc( 10px - var(--border-width) );
    margin-left: -10px;
    border-style: solid;
    border-width: 10px 10px 0 0px;
    border-color: var(--color-border) transparent transparent transparent;
  }

  /* attach css triangle */
  .message__user .message__bubble::after {
    right: calc( 10px - var(--border-width) );
    margin-right: -10px;
    border-style: solid;
    border-width: 0 10px 10px 0;
    border-color: transparent var(--color-border) transparent transparent;
  }

  .message--choice {
    min-width: 50%;
  }

  .message__options {
    font: var(--font-caption);
    padding: var(--distance-s);
    cursor: pointer;
    text-align: right;
  }

  .message__options :global(.icon) {
    vertical-align: middle;
    vertical-align: text-top;
  }
  
  li.choice-option {
    display: flex;
  }

  li.choice-option:not(:last-child) {
    margin-bottom: var(--distance-s);
  }

  ul:not(.selected) .choice-option:hover {
    cursor: pointer;
  }
  
  ul:not(.selected) li.choice-option {
  }

  li.choice-option.selected {
  }


</style>
