<script>
  
</script>

<div class="TabBar container">
  <div class="slider">
    <slot></slot>
  </div>
  
</div>

<style>
  .container {
    width: 100%;
    overflow-x: scroll;
  }

  .slider {
    white-space: nowrap;
    display: flex;
    width: 100%;
  }

  :global(.TabBar .slider .Tab) {
    border-top: 1px solid var(--color-border) !important;
    border-bottom: 1px solid var(--color-border) !important;
    border-right: 1px solid var(--color-border) !important;
  }

  :global(.TabBar .slider .Tab:first-child) {
    border-left: 1px solid var(--color-border) !important;
  }

  :global(.TabBar .slider .Tab.active) {
    border-top: none !important;
    border-bottom: none !important;
    border-left: none !important;
  }

  :global(.TabBar .slider .Tab:last-child.active) {
    border-right: none !important;
  }
</style>