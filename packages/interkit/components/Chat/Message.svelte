<script>
  import { createEventDispatcher } from 'svelte';

  import MessageDate from "./MessageDate.svelte";
  import Button from "../Button.svelte";
  import Icon from "../Icon.svelte";
  import MediaFileImage from "../MediaFileImage.svelte";

  const dispatch = createEventDispatcher();

  export let message
  export let preview = false
  export let submitChoice = () => {}
  export let submitLocation = () => {}
  export let isByUser = false
  export let lastFromSender = false
  export let previousMessage = null

  let showOptions = false

  let choiceSubmitted = false;
  const submitChoiceLocal = (message, key) => {
    if(choiceSubmitted) {
      console.log("prevented double submission")
      return;
    }
    choiceSubmitted = true; 
    submitChoice(message, key);
  }

  const startMessageOptionDialog = () => {
    if (window.confirm('Möchtest du diese Nachricht oder diesen Benutzer wegen unangemessener Inhalte an das Moderationsteam melden? Wir kümmern uns innerhalb von 24 Stunden darum.') === true) {
      report()
    }
    showOptions = false
  }

  const report = () => {
    dispatch('report', { message })
  }

  const submitLocationLocal = (message) => {
    if(choiceSubmitted) {
      console.log("prevented double submission")
      return;
    }
    choiceSubmitted = true; 
    submitLocation(message);
  }

</script>

{#if message?.payload?.options?.label}
<span class="message-label">{message?.payload?.options?.label}</span> 
{/if}

{#if ['text', 'choice', 'image', 'requestLocation'].indexOf(message?.payload?.type) > -1}   
  <div 
    class="message message--{message.payload.type}"
    class:message__user="{isByUser}"
    class:message__lastFromSender={lastFromSender}
  >
    <div
      class="message__bubble"
      on:click={() => { if (message?.payload?.type !== 'choice' && message?.payload?.type !== 'requestLocation') showOptions = true }}
      >
      <div class="message__contents">
        <!--<time datetime={message?.createdAt}>{message?.createdAt}</time>-->
        {#if message?.payload?.type == "text"}  
          {message?.payload?.text}
        {:else if message?.payload?.type == "image"}
          <MediaFileImage
            mediafileRef={{
              type: 'mediafile',
              value: message?.payload?.mediafileKey
            }}
            doFallback={true}
            />
        {:else if message?.payload?.type == "choice"}
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
                    on:click={()=>{submitChoiceLocal(message, key)}}
                    selected={message?.selectedChoiceKey == key}
                    height="auto"
                    flex="fill"
                  >
                    {message.payload.choice[key]}
                  </Button>
                </li>
              {/each}
            </ul>
          {/if}
        {:else if message?.payload?.type == "requestLocation"}
          <ul
            class="message__choices"
          >  
            <li 
              class="choice-option" 
            >
              <Button
                on:click={()=>{if(!message?.submitted) submitLocationLocal(message)}}
                selected={message?.submitted}
                height="auto"
                flex="fill"
              >
                {message.payload.prompt}
              </Button>
            </li>
          </ul>
        {/if}
      </div>
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
    position: relative;
    font: var(--font-body-1);
  }

  .message__contents {
    border-radius: var(--border-radius);
    overflow: hidden;
    background-color: var(--color-background);
    border-width: var(--border-width);
    border-color: var(--color-border);
    border-style: solid;
  }

  .message:not(.message--image) .message__contents {
    padding: var(--distance-s);
  }

  .message--choice, .message__user,
  .message--requestLocation, .message__user {
    text-align: right;
    align-self: flex-end;
  }

  .message:not(.message__user):not(.message--choice, .message--requestLocation) .message__contents {
    border-bottom-left-radius: 0;
  }

  .message__user .message__contents {
    border-bottom-right-radius: 0;
  }

  .message.message__lastFromSender .message__bubble {
    margin-bottom: var(--distance-m);
  }

  /* css triangle base */
  .message.message__lastFromSender .message__bubble::after {
    position: absolute;
    bottom: -10px;
    width: 0;
    height: 0;
    border-style: solid;
  }

  /* ◥ */
  .message.message__user .message__bubble::after {
    content: "";
    right: 0;
    border-width: 0 10px 10px 0;
    border-color: transparent var(--color-border) transparent transparent;
  }

  /* ◤ */
  .message:not(.message__user):not(.message--choice, .message--requestLocation) .message__bubble::after {
    content: "";
    left: 0;
    border-width: 10px 10px 0 0px;
    border-color: var(--color-border) transparent transparent transparent;
  }

  .message--choice, .message--requestLocation {
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
