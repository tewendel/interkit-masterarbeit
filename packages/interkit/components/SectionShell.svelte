<script>

  export let classes = ''

</script>

<div class={`${classes} SectionShell container`}>
  <slot/>
</div>

<style>
  .container {
    background-color: var(--color-background-backdrop);
    padding: var(--distance-s);
    gap: var(--distance-s);
    display: flex;
    flex-direction: column;
  }
</style>
