<script>
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'

  // blockly
  export let dismissText
  export let dismissTrigger
  export let helpText
  export let helpTrigger

  // internal
  export let dismissFunction
  export let helpFunction

  function onClick(event, func, trigger) {
    if (func) {
      func(event)
    }
    if (trigger) {
      executeTrigger(trigger)
    }
  }

</script>

<div class="Modal container">
  <div class="Modal__Content content">
    <slot name="content"></slot>
    <slot></slot>
  </div>
  <div class="Modal__Buttons buttons">
    <Button on:click={event => onClick(event, dismissFunction, dismissTrigger)} text={dismissText} />
    {#if helpText}
      <Button on:click={event => onClick(event, helpFunction, helpTrigger)} text={helpText} />
    {/if}
  </div>
</div>

<style>
  .container {
    position: fixed;
    top:0;
    left:0;
    width: 100vw;
    box-sizing:border-box;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    padding: 20px;
    background-color: white;
    border: 1px black solid;
    border-top: none;
  }
</style>
