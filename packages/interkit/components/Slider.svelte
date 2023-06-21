<script>

  import ContextProvider from './ContextProvider.svelte'
  export let slides

</script>

<div class="Slider container">
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

  .slider {
    display: flex;
    flex-flow: row nowrap;
    scroll-snap-type: x mandatory;
    width: 100%;
    overflow: auto;
    scrollbar-width: none;
    gap: var(--distance-s);
  }

  .slider[data-slides-amount="1"] .slide {
    width:100%;
  }

  .slide {
    width: 85%;
    flex: none;
    scroll-snap-align: center;
    /* important that they all are exactly the same width (only the first one has a border-left), otherwise it confuses AspectRatio */
    box-sizing: content-box;
    overflow: hidden; /* so border-radius works, TODO check iOS */
    border: var(--border-width) solid var(--border-color);
  }

  .slide:first-child {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    margin-left: var(--distance-s);
  }

  .slide:last-child {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    margin-right: var(--distance-s);
  }

  .slide + .slide {
    border-left: none;
  }

</style>
