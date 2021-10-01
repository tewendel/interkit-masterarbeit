<script>

  import { getContext } from 'svelte';

  // get context from parent element, for example ContentElement and pass the payload to the action
  const c = getContext("buttonBar");
  console.log("buttonPayload", c?.buttonPayload)
  const buttonPayload = c?.buttonPayload // this is a store

  import { executeTrigger } from '../actions'

  export let inverse = false
  export let nopadding = false
  export let color = null;
  export let type
  export let text // primary | secondary | tertiary TODO
  export let clickTrigger

  console.log(executeTrigger, clickTrigger)

  if (type === "primary") {
    inverse = true
  }

</script>

<span 
    on:click
    on:click={ () => executeTrigger(clickTrigger, $buttonPayload) }
    class="Button button" 
    class:nopadding 
    class:inverse 
    style={color && !inverse ? ("background-color:"+color) : ""}
  >
  { text || "" }
  <slot />
</span>

<style>
  .button {
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.87);
    border-radius: 16px;
    background-color: white;
    display: inline-flex;
    overflow: hidden;
    cursor: pointer;
  }

  .nopadding {
    padding: 0;
  }

  .button.inverse {
    background-color: black;
    color: white;
  }
  .button:empty {
    display: none;
  }
  .button.noborder {
    border: none;
  }
</style>