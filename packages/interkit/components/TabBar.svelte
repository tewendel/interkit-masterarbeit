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
  }

  :global(.TabBar span) {
    border-top: 1px solid var(--border-color) !important;
    border-bottom: 1px solid var(--border-color) !important;
    border-right: 1px solid var(--border-color) !important;
  }

  :global(.TabBar div.click-effect:first-child span) {
    border-left: 1px solid var(--border-color) !important;
  }

  :global(.TabBar div.click-effect span.nav-tab-selected) {
    border-top: none !important;
    border-bottom: none !important;
    border-left: none !important;
  }

  :global(.TabBar div.click-effect:last-child span.nav-tab-selected) {
    border-right: none !important;
  }
</style>