<script>
  export let zIndex = 1
</script>

<div
    class="Overlay"
    style={`z-index: ${zIndex};`}
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
  }

  :global(.Overlay > *) {
    pointer-events: all
  }
</style>