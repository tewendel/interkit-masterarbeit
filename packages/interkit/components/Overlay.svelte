<script>
  export let zIndex = 1
  export let customStyle;
  export let classes = ''
</script>

<div
  class={`Overlay ${classes}`}
  style={`z-index: ${zIndex};` + customStyle}
  >
  <slot></slot>
</div>

<style>
  div {
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  
    box-sizing: border-box;
    pointer-events: none;
    touch-action: none;
  }

  :global(.Overlay > *) {
    pointer-events: all;
    touch-action: auto;
  }
</style>
