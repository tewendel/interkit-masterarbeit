<script>

export let label

</script>

<div class="ModalPanel">
  <h2>{label}</h2>
  <slot></slot>
</div>

<style>

.ModalPanel {
  flex-grow: 1;
  background: lightblue;
  border: 1em solid blue;
  padding: 1em;
}

</style>

