<script>
  export let bottom
  export let top
  export let left
  export let right

  const attr = (name, value) => {
    return value ? name + ":" + value + ";" : ""
  }

</script>

<div
  class="Absolute"
  style={`
    ${attr("top", top)}
    ${attr("bottom", bottom)}
    ${attr("left", left)}
    ${attr("right", right)}
  `}
  >
  <slot></slot>
</div>

<style>

  ._workaround_ { /* vite sometimes strips the very first rule when HMR */ }

  div {
    position: absolute;
  }

</style>
