<script>

export let label

</script>

<div class="Sidebar">
  <h2>{label}</h2>
  <slot></slot>
</div>

<style>

.Sidebar {
  flex-grow: 0.1;
  background: lightgreen;
  border: 1em solid green;
  padding: 1em;
}

</style>
