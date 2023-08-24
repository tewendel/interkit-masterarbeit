<script>

  export let classes = ''

</script>

<div class={`${classes} SectionShell container`}>
  <slot/>
</div>

<style>

  .container {
    background-color: var(--color-background-backdrop);
    padding: calc(var(--inset) * 0.5rem);
    gap: calc(var(--outset-y) * 0.5rem);
    display: flex;
    flex-direction: column;
  }

  .container > :global(*) {
    /* we have gap for that (e.g. overrides Card) */
    margin-bottom: 0 !important;
  }

</style>
