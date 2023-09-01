<script>
  export let messageType = ''
  export let type = "other" // me | other
  export let showHandle = false
  export let showSide = false
  export let hasButtons = false
  export let transparent = false
</script>

<div
  class="root Bubble Bubble--type{type} Bubble--messagetype{messageType} message__bubble message__bubble--{type} message__bubble--message-{messageType}"
  class:showHandle
  class:showSide
  class:transparent
  class:hasButtons
  class:Bubble--hasbuttons={hasButtons}
  on:click
  >

  <slot />

</div>

<style>

  .message__bubble {
    position: relative;
    font: var(--font-body-1);
    letter-spacing: var(--letter-spacing-body-1);
    border-radius: var(--border-radius);
    overflow: hidden;
    /*
    border-width: var(--border-width);
    border-color: var(--color-border);
    border-style: solid;
    */
    box-shadow: var(--box-shadow);
    min-height: 1rem;
    min-width: 1rem;
  }

  .message__bubble.hasButtons {
    border-radius: calc(var(--border-radius-button) + var(--inset) * 0.5rem);
    /* the additional radius has to match message--contents padding */
  }

  .message__bubble.transparent {
    background-color: transparent;
  }

  .message__bubble--me {
    background-color: var(--color-background-chat-me);
  }

  .message__bubble--other {
    background-color: var(--color-background-chat-other);
  }

  .message__bubble--message-requestLocation,
  .message__bubble--message-choice {
    background-color: var(--color-background-highlight);
  }
  
  .message__bubble--other.showSide {
    border-bottom-left-radius: 0;
  }

  .message__bubble--me.showSide {
    border-bottom-right-radius: 0;
  }

</style>

<!--
  FIXME: showHandle (little triangle at bottom corner of speech bubble)
    doesn't work with bubble borders,
    neither with classic `border` nor with `box-shadow`

  .root {
    --message-triangle: 0.625rem;

  .showHandle {
    margin-bottom: var(--distance-m);
  } 

  /* css triangle base */
  .message__bubble::after {
    position: absolute;
    bottom: calc(-1 * var(--message-triangle));
    width: 0;
    height: 0;
    border-style: solid;
  }

  /* ◥ */
  .message__bubble--me.showHandle::after {
    content: "";
    right: 0;
    border-width: 0 var(--message-triangle) var(--message-triangle) 0;
    /* replace white with background color */
    border-color: transparent white transparent transparent;
  }

  /* ◤ */
    .message__bubble--other.showHandle::after {
    content: "";
    left: 0;
    border-width: var(--message-triangle) var(--message-triangle) 0 0;
    border-color: white transparent transparent transparent;
  }

-->
