<script>
  export let type = "other" // me | other
  export let showHandle = false
  export let showSide = false
  export let transparent = false
</script>

<div
  class="Bubble Bubble--type{type} message__bubble message__bubble--{type}"
  class:showHandle
  class:showSide
  class:transparent
  on:click
  >

  <slot />

</div>

<style>

  .message__bubble {
    position: relative;
    font: var(--font-body-1);
    border-radius: var(--border-radius);
    overflow: hidden;
    border-width: var(--border-width);
    border-color: var(--color-border);
    border-style: solid;
    min-height: 1em;
    min-width: 1em;
  }

  .message__bubble:not(.transparent) {
    background-color: var(--color-background);
  }

  .showHandle {
    margin-bottom: var(--distance-m);
  } 

  
  .message__bubble--other.showSide {
    border-bottom-left-radius: 0;
  }

  .message__bubble--me.showSide {
    border-bottom-right-radius: 0;
  }

  /* css triangle base */
  .message__bubble::after {
    position: absolute;
    bottom: -10px;
    width: 0;
    height: 0;
    border-style: solid;
  }

  /* .message.message__user .message__bubble::after */

  /* ◥ */
  .message__bubble--me.showHandle::after {
    content: "";
    right: 0;
    border-width: 0 10px 10px 0;
    border-color: transparent var(--color-border) transparent transparent;
  }

  /*   .message:not(.message__user):not(.message--choice, .message--requestLocation) .message__bubble */

  /* ◤ */
    .message__bubble--other.showHandle::after {
    content: "";
    left: 0;
    border-width: 10px 10px 0 0px;
    border-color: var(--color-border) transparent transparent transparent;
  }

</style>
