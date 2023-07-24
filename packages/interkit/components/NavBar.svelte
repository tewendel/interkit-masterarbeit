<div class="NavBar container">
  <slot/>
</div>

<style>

  .container {
    height: calc(var(--inset-y) * 1rem + 3rem);
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: calc(var(--outset-x) * 0.375rem);
    box-sizing: border-box;
  }
</style>
