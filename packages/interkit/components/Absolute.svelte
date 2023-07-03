<script>
  export let bottom
  export let top
  export let left
  export let right

  const attr = (name, value) => {
    return value ? name + ":" + value + ";" : ""
  }

</script>

<div style={`
    ${attr("top", top)}
    ${attr("bottom", bottom)}
    ${attr("left", left)}
    ${attr("right", right)}
`}>
  <slot></slot>
</div>

<style>
  div {
    position: absolute;
  }

</style>