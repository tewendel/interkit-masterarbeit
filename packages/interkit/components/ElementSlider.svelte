<script>

  import { onMount, getContext, onDestroy } from 'svelte'

  import { InterkitClient, util } from '../'

  import Slider from './Slider.svelte';

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("ElementSlider needs elementsContextProvider as parent");
  let elements = elementsContext?.elements;

</script>

<div class="container">
  {#if $elements}
    {#if $elements.length === 0}
      <div class="empty"><slot name="emptyElement"></slot></div>
    {:else}
      <Slider slides={$elements.map(e=>e.row)} let:slide={row}>
        <slot name="contentElement" element={row} />
      </Slider>
    {/if}
  {/if}
</div>

<style>

  .empty {
    margin-left: var(--distance-s);
  }
</style>