<script>
  export let top = "s"
  export let left = "s"
  export let bottom = "s"
  export let right = "s"

</script>

<div 
  class="container Spacing" 
  style="--distance-none: 0; padding: var(--distance-{top}) var(--distance-{right}) var(--distance-{bottom}) var(--distance-{left})"
  >
  <slot />
</div>
