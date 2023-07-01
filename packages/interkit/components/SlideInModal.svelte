<script>

  import ModalHeader from "./fragments/ModalHeader.svelte"
  import ButtonBar from "./ButtonBar.svelte"
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  
  export let label
  export let headline
  export let prompt
  export let description

  let showDummyData =  getShowDummyDataStore();
  if($showDummyData) {
    description = "Description lorem ipsum..."
  }

</script>


<div class="SlideInModal container">
  <div class="header">
    <ModalHeader
      size="full"
      {label}
      {headline}
      {prompt}
    />
  </div>
  {#if description}<div class="description">{description}</div>{/if}
  <div class="buttons">
    <ButtonBar hideHelpText>
      <slot name ="buttons"/>
    </ButtonBar>
  </div>
</div>
  

<style>

  .container {    
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: var(--distance-s);
    box-sizing: border-box;
    background-color: var(--color-background-highlight);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .header {
    padding: 16px;
  }

  .description {
    padding: 0px 16px 16px 16px; 
    font: var(--font-content-body-2);
    letter-spacing: var(--letter-spacing-content-body-2);
    color: var(--color-text-soft);
  }



</style>