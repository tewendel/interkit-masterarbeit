<script>
  
</script>

<div class="TabBar container">
  <div class="TabBar__Slider slider">
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

  /* FIXME get rid of those !importants */
  :global(.TabBar .slider .Tab) {
    border-top: var(--border-width) solid var(--color-border-button-primary) !important;
    border-bottom: var(--border-width) solid var(--color-border-button-primary) !important;
    border-right: var(--border-width) solid var(--color-border-button-primary) !important;
  }

  :global(.TabBar .slider .Tab:first-child) {
    border-left: var(--border-width) solid var(--color-border-button-primary) !important;
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
