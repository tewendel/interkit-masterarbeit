<script>

  import ContentElementAudio from './ContentElementAudio.svelte';
  
  export let title;
  export let elementRows;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;
  export let imageColumn;

</script>

<div class="ElementSlider container">
  <h3 class="ElementSlider__title title">{title}</h3>

  {#if elementRows}
    <div class="ElementSlider__Slider slider" data-slides-amount={elementRows.length}>
      {#each elementRows as element}
        <div class="ElementSlider__Slide slide">
          <ContentElementAudio
            {element}
            nameColumn = {titleColumn}
            {audioColumn}
            {descriptionColumn}
            {imageColumn}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>


<style> 

  .container {
    width: 100%;
  }

  .title {}

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