<script>
  export let bottom
  export let top
  export let left
  export let right

  const attr = (name, value) => {
    return value ? name + ":" + value + "px;" : ""
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

  ._workaround_ {}

  div {
    position: absolute;
  }

</style>
