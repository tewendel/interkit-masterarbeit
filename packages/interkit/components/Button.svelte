<script>

  import { executeTrigger } from '../actions'
  import { getContext } from 'svelte';

  export let nopadding = false
  export let color = null;
  export let type = "secondary" // primary | secondary | ghost | link | spacer
  export let size =  "medium" // small | medium | large // TODO inherit from ButtonBar?
  export let flex = "normal" // normal | fill
  export let height = "fixed" // fixed | auto
  export let text = undefined;
  export let selected = false
  export let clickType = 'payloadTrigger'; // link | linkTargetBlank
  
  export let clickTrigger = null; // set this to execute a trigger on button click
  export let onClick = null // function to call on click if we are not using this with triggers


  // get context from parent element, for example ContentElement and pass the payload to the action
  const c = getContext("buttonBar");
  const buttonPayload = c?.buttonPayload // this is a store
  if(buttonPayload) {
    //console.log("buttonPayload", $buttonPayload)
  }

  const handleClick = () => {

    if(clickTrigger)
      executeTrigger(clickTrigger, buttonPayload ? $buttonPayload : undefined)

    if(onClick)
      onClick(buttonPayload ? $buttonPayload : undefined);
  }

</script>

{#if clickType === 'payloadTrigger'}
  <span 
      on:click
      on:click={handleClick}
      class={`Button Button--${type} Button--${size} button ${type} ${size} ${flex} height-${height}`}
      class:primary={type==='primary'}
      class:selected={selected}
      class:Button--selected={selected}
      class:nopadding 
    >
    <slot/>
    { text || "" }
  </span>
{:else}
  <a
      href={clickTrigger}
      target={clickType === 'linkTargetBlank' ? '_blank' : '_self'}
      class={`Button Button--${type} Button--${size} button ${type} ${size} ${flex} height-${height}`}
      class:primary={type==='primary'}
      class:selected={selected}
      class:Button--selected={selected}
      class:nopadding 
    >
    <slot/>
    { text || "" }
  </a>
{/if}


<style>

  .button {
    border: var(--border-width) solid var(--border-color);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    box-shadow: var(--box-shadow);
    display: inline-flex;
    gap: var(--distance-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
  }

  .button.normal {
    flex-grow: 0;
  }

  .button.fill {
    flex-grow: 1;
  }

  .button.small {
    min-height: 32px;
    padding: var(--distance-tiny) var(--distance-s);
    font: var(--font-button);
  }

  .button.small.height-fixed {
    height: 32px;
  }

  .button.medium {
    min-height: 40px;
    padding: var(--distance-tiny) var(--distance-m);
    font: var(--font-button);
  }

  .button.medium.height-fixed {
    height: 40px;
  }

  .button.large {
    min-height: 56px;
    padding: var(--distance-tiny) var(--distance-s-m);
    font: var(--font-headline-5);
  }

  .button.large.height-fixed {
    height: 56px;
  }

  .button.selected {
    background-color: var(--color-background-highlight);
  }

  .button.ghost {
    background-color: transparent;
  }

  .button.link {
    border: none;
    background-color: transparent;
    padding-left: var(--distance-xs);
    padding-right: var(--distance-xs);
  }

  .button.spacer {
    visibility: hidden;
    pointer-events: none;
  }

  .primary {
    color: var(--color-text-button-primary);
    background-color: var(--color-background-button-primary);
  }

  span.button {
    font-size: var(--font-size-buttons);
  }

  .nopadding {
    padding: 0;
  }

  .button:empty {
    display: none;
  }

  .button.noborder {
    border: none;
  }

</style>
