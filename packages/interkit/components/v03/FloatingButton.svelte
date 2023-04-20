<script>
  import { executeTrigger } from '../actions'

  export let text
  export let clickTrigger
  export let x_pos = "calc(100% - 100px)"
  export let y_pos = "calc(100% - 100px)"

  console.log(executeTrigger, clickTrigger)

</script>

<div 
    style={`--x: ${x_pos}; --y: ${y_pos}`}
    on:click={ () => executeTrigger(clickTrigger) }
  >
  <p>
    {text}
  </p>
</div>

<style>
  div {
    border-radius: var(--border-radius-button);
    background: grey;
    position: absolute;
    left: var(--x);
    top: var(--y);
    cursor: pointer;
  }

  p {
    padding: 1ex;
  }
</style>
