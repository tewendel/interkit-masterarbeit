<script>

  import ModalHeader from "./fragments/ModalHeader.svelte"
  import ButtonBar from "./ButtonBar.svelte"
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  
  export let label
  export let headline
  export let prompt
  export let description

  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    description = "Description lorem ipsum..."
  }

</script>


<div class="SlideInModal container">
  <div class="SlideInModal__Header header">
    <ModalHeader
      size="full"
      {label}
      {headline}
      {prompt}
    />
  </div>
  {#if description}<div class="description SlideInModal__Description">{description}</div>{/if}
  <div class="buttons SlideInModal__Buttons">
    <ButtonBar hideHelpText>
      <slot name="buttons"/>
    </ButtonBar>
  </div>
</div>
  

<style>

  .container {    
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--inset-y) * 0.5rem);
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem);
    box-sizing: border-box;
    background-color: var(--color-background-highlight);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .header {
    padding:
      calc(var(--outset-y) * 1rem)
      calc(var(--outset-x) * 1rem);
  }

  .description {
    padding:
      0
      calc(var(--outset-x) * 1rem)
      calc(var(--outset-y) * 1rem)
      calc(var(--outset-x) * 1rem);
    font: var(--font-content-body-2);
    letter-spacing: var(--letter-spacing-content-body-2);
    color: var(--color-text-soft);
  }

</style>
