<script>

  import ContentElementAudio from './ContentElementAudio.svelte';
  import SectionHeadline from './SectionHeadline.svelte'
  
  export let title;
  export let elementRows;
  export let elementColumns;
  export let categoryColumns;
  export let categoryIndex = 0;

</script>

<div class="ElementSlider container">
  <h3 class="ElementSlider__title title">
    <SectionHeadline>
      {title}
    </SectionHeadline>
  </h3>

  {#if elementRows}
    <div class="ElementSlider__Slider slider" data-slides-amount={elementRows.length}>
      {#if elementRows.length}
        {#each elementRows as element}
          <div class="ElementSlider__Slide slide">
            <ContentElementAudio
            {element}
            {elementColumns}
            {categoryColumns}
            {categoryIndex}
            />
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
  }

  .slider[data-slides-amount="1"] .slide {
    width:100%;
  }

  .slide {
    width: 80%;
    flex: none;
    border: 1px solid gray;
    scroll-snap-align: center;
    box-sizing: border-box;
  }

  .slide + .slide {
    border-left: none;
  }


</style>