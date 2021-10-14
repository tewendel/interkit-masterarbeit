<script>
  import { executeTrigger } from '../actions'
  import Button from './Button.svelte'

  export let dismissText
  export let dismissTrigger
  export let helpText
  export let helpTrigger
</script>

<div class="Modal container">
  <div class="Modal__Content content">
    <slot name="content"></slot>
  </div>
  <div class="Modal__Buttons buttons">
    <Button on:click={() => executeTrigger(dismissTrigger)} text={dismissText} />
    <Button on:click={() => executeTrigger(helpTrigger)} text={helpText} />
  </div>
</div>

<style>
  .container {
    position: fixed;
    top:0;
    width: 100vw;
    box-sizing:border-box;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    padding: 20px;
    background-color: white;
    border: 1px black solid;
  }
</style>
