<div class="AppBase">
  <slot ></slot>
</div>

<style>
  .AppBase {
    height: 100%;
  }
  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
  }
</style>