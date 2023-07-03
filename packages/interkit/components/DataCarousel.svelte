<script>

  import { getContext } from 'svelte'
  import { InterkitClient } from '..'

  import Slider from './Slider.svelte';

  export let mode;
  export let roundedCorners;
  export let background;
  export let gaps;

  let elementsContext = getContext("elements");
  if(!elementsContext) console.warn("DataSlider needs DataLoaderSingle or DataRouteMulti as parent");
  let elements = elementsContext?.elements;

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [...Array(10).keys()].map((k) => {return {key: `${k}`, values: {}}})

</script>

<div class="DataCarousel container">
  {#if $elements?.length || $showDummyData }
    <Slider 
      continuous={mode == "continuous"} 
      slides={$showDummyData ? dummyData : $elements?.map(e=>e.row)}
      {roundedCorners}
      {background}
      {gaps}
    >
      <slot name="contentElement"></slot>
    </Slider>
  {:else}
    <div class="DataCarousel__Empty empty"><slot name="emptyElement"></slot></div>
  {/if}
</div>

<style>

  .empty {
    margin-left: var(--distance-s);
  }
</style>
