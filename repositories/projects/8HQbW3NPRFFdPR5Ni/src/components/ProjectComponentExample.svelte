<script>
  export let text = "override this example text in blockly!"
  // preset option value should match the first option in yaml
  export let options = "red"
</script>

<p style="--color: {options}">
  {text}
</p>

<slot></slot>

<style>
  p {
    background-color: var(--color);
  }
</style>
