<script>

  import Icon from "../Icon.svelte";  
  import Label from "../Label.svelte";
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  

  export let variant = "full"; // full, large, medium, small
  export let active = false; 

  export let label_1
  export let subtitle_1
  export let headline
  export let label_2
  export let subtitle_2
  export let label_3
  export let subtitle_3
  export let description
  export let rightArrow = false;

  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    label_1 = "label_1"
    subtitle_1 = "subtitle_1"
    headline = "headline"
    label_2 = "label_2"
    subtitle_2 = "subtitle_2"
    label_3 = "label_3"
    subtitle_3 = "subtitle_3"
    description = "description"
  }
  
</script>

<div class="card-header {variant} {active}">

  {#if label_1 || subtitle_1}
    <div class="row-1">
      {#if label_1}<Label content={label_1} variant="normal"/>{/if}<span class="subtitle_1">{subtitle_1}</span>
    </div>
  {/if}

  {#if headline}
    <div class="row-2">
      <span class="headline">{headline}</span>      
      <div class="headline-widgets">
        <slot name="widgets"></slot>
        {#if rightArrow}
          <span class="right-arrow">
            <Icon type="Thin-Arrow-Right"/>
          </span>
        {/if}
      </div>
    </div>
  {/if}

  {#if label_2 || subtitle_2}
    <div class="row-3">
      {#if label_2}<Label content={label_2} variant="strong"/>{/if}<span class="subtitle_2">{subtitle_2}</span>
    </div>
  {/if}

  {#if label_3 || subtitle_3}
    <div class="row-4">
      {#if label_3}<Label content={label_3} variant="soft"/>{/if}<span class="subtitle_3">{subtitle_3}</span>
    </div>
  {/if}

  {#if description}
    <div class="description">
      {description}
    </div>
  {/if}

</div>

<style>

  .card-header {
    width: 100%;
  }

  .row-1 {
    height: 20px;
  }

  .subtitle_1 {
    font: var(--font-caption);
  }

  .row-2 {
    display: flex;
    flex-direction: row;
  }

  .card-header .headline {
    flex-grow: 1;
  }
  
  .card-header.full .headline {
    font: var(--font-content-headline-2);
    letter-spacing: var(--letter-spacing-content-headline-2);
  }

  .card-header.large .headline {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
  }

  .card-header.medium .headline {
    font: var(--font-content-headline-4);
    letter-spacing: var(--letter-spacing-content-headline-4);
  }

  .card-header.small .headline {
    font: var(--font-content-headline-4);
    letter-spacing: var(--letter-spacing-content-headline-4);
  }

  .headline-widgets {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right-arrow {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 8px;
  }

  .row-3 {
    padding: 4px 16px 4px 0px;
  }

  .subtitle_2 {
    font: var(--font-caption);
  }

  .row-4 {
    padding: 4px 16px 2px 0px;
  }

  .subtitle_3 {
    font: var(--font-caption-bold);
  }
  
  .description {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    padding: 4px 16px 2px 0px;
  }

  
</style>