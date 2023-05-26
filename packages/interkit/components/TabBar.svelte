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

  :global(.TabBar a span, .TabBar span) {
    border-top: 1px solid var(--border-color) !important;
    border-bottom: 1px solid var(--border-color) !important;
    border-right: 1px solid var(--border-color) !important;
  }

  :global(.TabBar a:first-child span, .TabBar div.link:first-child span) {
    border-left: 1px solid var(--border-color) !important;
  }

  :global(.TabBar a span.nav-tab-selected, .TabBar div.link span.nav-tab-selected) {
    border-top: none !important;
    border-bottom: none !important;
    border-left: none !important;
  }

  :global(.TabBar a:last-child .nav-tab-selected, .TabBar div.link:last-child .nav-tab-selected) {
    border-right: none !important;
  }
</style>