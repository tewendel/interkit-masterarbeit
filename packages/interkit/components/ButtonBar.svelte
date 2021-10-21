<div class="ButtonBar container">
  <slot/>
</div>

<style>

  .container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding: var(--distance-s);
    gap: var(--distance-s); /* not compatible with old browsers */
    display: inline-flex;
    box-sizing: border-box;
  }

</style>