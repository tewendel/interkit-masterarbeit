<script>

  import ContextProvider from './ContextProvider.svelte'
  export let slides

  export let continuous = true;
  export let roundedCorners;
  export let background;
  export let gaps;
  
</script>

<div class="Slider container" class:continuous class:roundedCorners class:background class:gaps>
  {#if slides}
    <div class="Slider__Slider slider" data-slides-amount={slides.length}>
      {#if slides.length}
        {#each slides as slide}
          <div class="Slider__Slide slide">
            <ContextProvider 
              name="element" 
              value={slide}
            >
              <slot></slot>
            </ContextProvider>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style> 

  .container {
    width: 100%;
  }

  .container.background {
    padding:
      calc(var(--outset-y) * 0.5rem)
      0;
  }

  .container.background {
    background-color: var(--color-background-backdrop);
  }

  .slider {
    display: flex;
    flex-flow: row nowrap;
    scroll-snap-type: x mandatory;
    width: 100%;
    overflow: auto;
    scrollbar-width: none;
  }

  .container.gaps .slider {
    gap: calc(var(--outset-x) * 0.5rem)
  }

  .container:not(.continuous) .slider[data-slides-amount="1"] .slide {
    width:100%;
  }

  .slide {
    width: 85%;
    flex: none;
    scroll-snap-align: center;
    /* important that they all are exactly the same width (only the first one has a border-left), otherwise it confuses AspectRatio */
    box-sizing: content-box;
    border: var(--border-width) solid var(--border-color);
    padding: 0.0625rem 0; /* otherwise box shadow is cut off */
  }

  .container.continuous .slide {
    width: auto;
  }

  .container.roundedCorners .slide:first-child {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .container.roundedCorners .slide:last-child {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  .container.background .slide:first-child {
    margin-left: calc(var(--outset-x) * 0.5rem)
  }
  
  .container.background .slide:last-child {
    margin-right: calc(var(--outset-x) * 0.5rem)
  }

  .slide + .slide {
    border-left: none;
  }

</style>
