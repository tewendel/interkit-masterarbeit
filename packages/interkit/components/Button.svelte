<script>

  import { executeTrigger } from '../actions'
  import { getContext } from 'svelte';

  export let nopadding = false
  export let color = null
  export let type = 'secondary'
  export let text // primary | secondary | tertiary TODO
  
  export let clickTrigger // set this to execute a trigger on button click
  export let onClick // function to call on click if we are not using this with triggers


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
      onClick();
  }

</script>

<span 
    on:click
    on:click={handleClick}
    class={`Button Button--${type} button ${type}`}
    class:primary={type==='primary'}
    class:nopadding 
  >
  <slot/>
  { text || "" }

</span>

<style>

  .button {
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.87);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    display: inline-flex;
    overflow: hidden;
    cursor: pointer;
    align-items: center;
  }

  .primary {
    color: var(--color-text-button-primary);
    background-color: var(--color-background-button-primary)
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
