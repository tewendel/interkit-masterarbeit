<script>
  export let messageType = ''
  export let type = "other" // me | other
  export let showHandle = false
  export let showSide = false
  export let transparent = false
</script>

<div
  class="Bubble Bubble--type{type} Bubble--messagetype{messageType} message__bubble message__bubble--{type} message__bubble--message-{messageType}"
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
    border-radius: var(--border-radius-button);
    overflow: hidden;
    /*
    border-width: var(--border-width);
    border-color: var(--color-border);
    border-style: solid;
    */
    box-shadow: var(--box-shadow);
    min-height: 1em;
    min-width: 1em;
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

  .showHandle {
    margin-bottom: var(--distance-m);
  } 

  /* css triangle base */
  .message__bubble::after {
    position: absolute;
    bottom: -10px;
    width: 0;
    height: 0;
    border-style: solid;
  }

  /* ◥ */
  .message__bubble--me.showHandle::after {
    content: "";
    right: 0;
    border-width: 0 10px 10px 0;
    /* replace white with background color */
    border-color: transparent white transparent transparent;
  }

  /* ◤ */
    .message__bubble--other.showHandle::after {
    content: "";
    left: 0;
    border-width: 10px 10px 0 0px;
    border-color: white transparent transparent transparent;
  }

-->
