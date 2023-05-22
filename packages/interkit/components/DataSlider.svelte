<script>

  import { getContext } from 'svelte'
  import { InterkitClient } from '..'

  import Slider from './Slider.svelte';

  let elementsContext = getContext("elements");
  if(!elementsContext) console.warn("DataSlider needs DataLoader or DataRouteMulti as parent");
  let elements = elementsContext?.elements;

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [...Array(10).keys()].map((k) => {return {key: `${k}`, values: {}}})

</script>

<div class="container">
  {#if $elements?.length || $showDummyData }
    <Slider slides={$showDummyData ? dummyData : $elements?.map(e=>e.row)}>
      <slot name="contentElement"></slot>
    </Slider>
  {:else}
    <div class="empty"><slot name="emptyElement"></slot></div>
  {/if}
</div>

<style>

  .empty {
    margin-left: var(--distance-s);
  }
</style>