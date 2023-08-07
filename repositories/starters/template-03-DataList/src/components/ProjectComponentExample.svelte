<script>
  export let text = "override this example text in blockly!"
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