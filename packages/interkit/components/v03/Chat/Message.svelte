<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { executeTrigger } from '../../actions';
  import { InterkitClient } from "../../"

  import MessageDate from "./MessageDate.svelte";
  import Bubble from "./Bubble.svelte"
  import Button from "../Button.svelte";
  import Icon from "../Icon.svelte";
  import InlineAudioPlayerButton from '../InlineAudioPlayerButton.svelte';
  import InlineVideoPlayer from '../InlineVideoPlayer.svelte';
  import MediaFileImage from '../MediaFileImage.svelte'
  import ChatImage from "./ChatImage.svelte"

  const dispatch = createEventDispatcher();

  export let message
  export let preview = false
  export let submitChoice = () => {}
  export let submitLocation = () => {}
  export let isByUser = false
  export let lastFromSender = false
  export let previousMessage = null
  export let isReportable = true

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

  const submitLocationLocal = async (message, canceled=false) => {
    if(choiceSubmitted) {
      console.log("prevented double submission")
      return;
    }
    choiceSubmitted = true; 
    if(await submitLocation(message, canceled)) {
      console.log("keeping choiceSubmitted true after sucessful submission")
    } else {
      console.log("resetting choiceSubmitted true after error on submission")
      choiceSubmitted = false;
    }
  }

  const capacitorLinkClickHandler = message => {
    const url = message?.payload?.url || message?.payload?.options?.url
    const isGmaps = message?.payload?.options?.gmaps === true
    return evt => {
      // ios strategy copied from ExternalMapAppButton
      if (Capacitor && Capacitor.getPlatform() === 'ios' && isGmaps) {
        evt.preventDefault()
        window.open(url)
        return
      }
      // on android & web, pass thru to target=_blank
    }
  }

  onMount(() => {
    dispatch('mounted')
  })

  $: userId = InterkitClient.userId

</script>

{#if message?.payload?.options?.label}
  <span class="message-label">{message?.payload?.options?.label}</span> 
{/if}

{#if message?.payload?.type === 'empty'}
  {@html '<!-- empty message -->'}
{:else if message?.payload?.type == "system" }
  <div class="system">
    {message?.payload?.text}
  </div>
{:else if message?.payload?.type == "systemImage" }
  <div class="system system-image {message?.payload?.options?.placement ? `placement-${message?.payload?.options?.placement}` : ""}">
    <MediaFileImage
      mediafileRef={{
        type: 'mediafile',
        value: message?.payload?.mediafileKey
      }}
      fitDimension = "width"
      objectFit = "contain"
      style = { message?.payload?.options?.width ? `width: ${message?.payload?.options?.width}` : null}
      doFallback={true}
    />
  </div>  
{:else if ['text', 'link', 'choice', 'image', 'audio', 'video', 'requestLocation'].includes(message?.payload?.type)}
  <div 
    class="message message--{message.payload.type}"
    class:message__user="{isByUser}"
    class:message__lastFromSender={lastFromSender}
    class:contain={message?.payload?.options?.objectFit === "contain"}
  >
    <Bubble
      type = { isByUser ? "me" : "other" }
      showHandle = { lastFromSender && !["choice", "requestLocation"].includes(message?.payload?.type) }
      showSide = { !["choice", "requestLocation", "audio", "video", "image"].includes(message?.payload?.type) }
      on:click={() => { 
        if (['text', 'image'].includes(message?.payload?.type) && !message?.payload?.options?.action) {
          showOptions = true 
        }
        if (message?.payload?.type == "image" && message?.payload?.options?.action) {
          executeTrigger(message?.payload?.options?.action?.trigger, message?.payload?.options?.action?.payload)
        }
      }}
      >
      <div class="message__contents {message?.payload?.options?.customClass}">
        <!--<time datetime={message?.createdAt}>{message?.createdAt}</time>-->
        {#if message?.payload?.type == "text"}  
          {message?.payload?.text}
        {:else if message?.payload?.type === 'link'}
          {#if message?.payload?.url}
            <a
              href={message?.payload?.url}
              target="_blank"
              on:click={capacitorLinkClickHandler(message)}
              >{message?.payload?.text}</a>
          {:else}
            {message?.payload?.text}
          {/if}
        {:else if message?.payload?.type == "image"}
          {#if message?.payload?.options?.url}
            <!-- add a link around image -->
            <a
              href={message?.payload?.options?.url}
              target="_blank"
              on:click={capacitorLinkClickHandler(message)}
            >
              <ChatImage {message} />
            </a>
          {:else}
            <ChatImage {message} />
          {/if}
        {:else if message?.payload?.type == "audio"}
            <InlineAudioPlayerButton
              audioKeyDirect={message?.payload?.mediafileKey}
              autoplay={message?.payload?.options?.autoplay && !(message?.seen || []).includes($userId)}
            />
        {:else if message?.payload?.type == "video"}
            <InlineVideoPlayer
              mediafileKey={message?.payload?.mediafileKey}
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
                selected={message?.submitted && !message?.canceled}
                height="auto"
                flex="fill"
              >
                {message.payload.prompt}
              </Button>
            </li>
            {#if message.payload.cancel}
              <li 
                class="choice-option" 
              >
                <Button
                  on:click={()=>{if(!message?.submitted) submitLocationLocal(message, true)}}
                  selected={message?.canceled}
                  height="auto"
                  flex="fill"
                >
                  {message.payload.cancel}
                </Button>
              </li>
            {/if}
          </ul>
        {/if}
      </div>
    </Bubble>
    <MessageDate {message} {previousMessage} {lastFromSender} />
    {#if showOptions}
      {#if isReportable}
        <div
          class="message__options"
          on:click={() => { startMessageOptionDialog() }}
          >
          <Icon type="Full-Warning" height="1.2em" />
          Inhalte melden
        </div>
      {/if}
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
    --chat-image-height: 200px;
  }

  .message-label {
    font: var(--font-caption-bold);
    margin-bottom: var(--distance-xs);
  }

  .system {
    text-align: center;
    font: var(--font-caption-bold);
    padding: var(--distance-s) var(--distance-m) var(--distance-m) var(--distance-m);
  }

  .system-image {
    padding: var(--distance-s) 0 var(--distance-m) 0;
    display: flex;
    justify-content: center;
  }

  .system-image.placement-me {
    justify-content: flex-end;
  }

  .system-image.placement-other {
    justify-content: flex-start;
  }
  
  .message--image:not(.contain) .message__contents, 
  .message--video .message__contents {
    height: var(--chat-image-height); /* this is especially important for ios safari */
  }

  .message--audio .message__contents {
    height: 34px;
  }

  .message:not(.message--image):not(.message--video) .message__contents {
    padding: var(--distance-s);
  }

  .message--choice, .message__user,
  .message--requestLocation, .message__user {
    text-align: left;
    align-self: flex-end;
  }

  .message--link .message__contents {
    text-decoration: underline;
  }

  .message--link .message__contents a {
    color: inherit;
    word-break: break-all;
  }

  .message.message__lastFromSender  {
    margin-bottom: var(--distance-m);
  }

  .message--choice, .message--requestLocation {
    min-width: 50%;
  }

  .message__options {
    font: var(--font-caption);
    padding: var(--distance-s);
    cursor: pointer;
    text-align: center;
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
