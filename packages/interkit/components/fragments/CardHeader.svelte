<script>

  import Icon from "../Icon.svelte";  
  import Label from "../Label.svelte";
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  

  export let variant = "full"; // full, large, medium, small
  export let active = false; 
  export let rightArrow = false;

  export let label1
  export let subtitle1
  export let headline
  export let label2
  export let subtitle2
  export let label3
  export let subtitle3
  export let description
  
  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    label1 = "label1"
    subtitle1 = "subtitle1"
    headline = "headline"
    label2 = "label2"
    subtitle2 = "subtitle2"
    label3 = "label3"
    subtitle3 = "subtitle3"
    description = "description"
  }
  
</script>

<div class="card-header {variant} {active}">

  {#if label1 || subtitle1}
    <div class="row-1">
      {#if label1}<Label content={label1} variant="normal"/>{/if}
      {#if subtitle1}<span class="subtitle1">{subtitle1}</span>{/if}
    </div>
  {/if}

  {#if headline || rightArrow || $$slots.chips}
    <div class="row-2">
      <span class="headline">{#if headline}{headline}{/if}</span>
      <div class="headline-chips">
        <slot name="chips"></slot>
        {#if rightArrow}
          <span class="right-arrow">
            <Icon type="Thin-Arrow-Right"/>
          </span>
        {/if}
      </div>
    </div>
  {/if}

  {#if label2 || subtitle2}
    <div class="row-3">
      {#if label2}<Label content={label2} variant="strong"/>{/if}
      {#if subtitle2}<span class="subtitle2">{subtitle2}</span>{/if}
    </div>
  {/if}

  {#if label3 || subtitle3}
    <div class="row-4">
      {#if label3}<Label content={label3} variant="soft"/>{/if}
      {#if subtitle3}<span class="subtitle3">{subtitle3}</span>{/if}
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
    box-sizing: border-box;
  }

  .card-header.full {
    padding: 8px;
  }

  .row-1, .row-2, .row-3 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .row-1 {
    padding: 0px 16px 0px 0px;
  }

  .subtitle1 {
    font: var(--font-caption);
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

  .headline-chips {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
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

  .subtitle2 {
    font: var(--font-caption);
  }

  .row-4 {
    padding: 2px 16px 0px 0px;
  }

  .subtitle3 {
    font: var(--font-caption-bold);
  }
  
  .description {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    padding: 4px 16px 2px 0px;
  }

  
</style>