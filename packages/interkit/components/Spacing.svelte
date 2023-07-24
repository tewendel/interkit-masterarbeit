<script>
  export let top = "s"
  export let left = "s"
  export let bottom = "s"
  export let right = "s"
  // TODO could be scaled by inset/outset, but we don't know whether it is used inset or outset!
  //   would probably need new components, or another param like "absolute|scaled as inset|scaled as outset"
</script>

<div 
  class="container Spacing" 
  style="
    --distance-none: 0;
    padding:
      var(--distance-{top})
      var(--distance-{right})
      var(--distance-{bottom})
      var(--distance-{left});"
  >
  <slot />
</div>
