<script>
  export let x_pos = "calc(100% - 100px)"
  export let y_pos = "calc(100% - 100px)"

</script>

<div style={`--x: ${x_pos}; --y: ${y_pos}`}>
  <slot></slot>
</div>

<style>
  div {
    position: absolute;
    left: var(--x);
    top: var(--y);
  }

  p {
    padding: 1ex;
  }
</style>