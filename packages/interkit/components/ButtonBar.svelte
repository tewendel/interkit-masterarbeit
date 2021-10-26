<div class="ButtonBar container"
  bind:this={container}
  on:scroll|passive={scrolled}
  class:left={isLeft}
  class:right={isRight}
  >
  <div class="wrap">
    <slot/>
  </div>
</div>

<script>

  import { onMount } from 'svelte';

  let container

  let isLeft = true
  let isRight = true

  const scrolled = function (e) {
    isLeft = container.scrollLeft === 0
    isRight = Math.abs(container.clientWidth + container.scrollLeft - container.scrollWidth) <= 1
    console.log(container.clientWidth + container.scrollLeft - container.scrollWidth)
  }

  onMount(() => {
    scrolled()
    window.setTimeout(scrolled, 100)
  })

</script>

<style>

  .container {
    width: 100%;
    max-width: 100%;
    scrollbar-width: none;
    overflow-x: auto;
    box-sizing: border-box;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  .container.left {
    border-left-color: transparent;
  }

  .container.right {
    border-right-color: transparent;
  }

  .wrap {
    box-sizing: border-box;
    min-width: 100%;
    white-space: nowrap;
    padding: var(--distance-s);
    gap: var(--distance-s); /* not compatible with old browsers */
    display: flex;
  }

  .wrap > :global(*) { /* wow */
    flex-shrink: 0;
  }

</style>
