<div class="container">
  <slot/>
</div>

<style>
  .container {
    background-color: var(--color-background-backdrop);
    padding: 8px;
    gap: 8px;
    display: flex;
    flex-direction: column;
  }
</style>