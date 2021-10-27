<script>
  export let zIndex = 1
  export let customStyle;
</script>

<div
    class="Overlay"
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
    pointer-events: none;
    touch-action: none;
  }

  :global(.Overlay > *) {
    pointer-events: all;
    touch-action: auto;
  }
</style>