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

<div class="CardHeader CardHeader--variant{variant} CardHeader--active{active} card-header {variant} {active}">

  {#if label1 || subtitle1}
    <div class="row-1 CardHeader__Row1">
      {#if label1}<Label content={label1} variant="normal"/>{/if}
      {#if subtitle1}<span class="CardHeader__Subtitle1 subtitle1">{subtitle1}</span>{/if}
    </div>
  {/if}

  {#if headline || rightArrow || $$slots.chips}
    <div class="row-2 CardHeader__Row2">
      <span class="headline CardHeader__Headline">{#if headline}{headline}{/if}</span>
      <div class="headline-chips CardHeader__HeadlineChips">
        <slot name="chips"></slot>
        {#if rightArrow || $showDummyData}
          <span class="right-arrow CardHeader__RightArrow">
            <Icon type="Thin-Arrow-Right"/>
          </span>
        {/if}
      </div>
    </div>
  {/if}

  {#if label2 || subtitle2}
    <div class="row-3 CardHeader__Row3">
      {#if label2}<Label content={label2} variant="strong"/>{/if}
      {#if subtitle2}<span class="subtitle2 CardHeader__Subtitle2">{subtitle2}</span>{/if}
    </div>
  {/if}

  {#if label3 || subtitle3}
    <div class="row-4 CardHeader__Row3">
      {#if label3}<Label content={label3} variant="soft"/>{/if}
      {#if subtitle3}<span class="subtitle3 Cardheader__Subtitle3">{subtitle3}</span>{/if}
    </div>
  {/if}

  {#if description}
    <div class="description CardHeader__Description">
      {description}
    </div>
  {/if}

</div>

<style>

  .card-header {
    width: 100%;
    box-sizing: border-box;
  }

  .card-header.large {
    padding: calc(var(--inset-y) * 0.5rem) calc(var(--inset-x) * 0.5rem);
  }

  .card-header.full {
    padding: calc(var(--inset-y) * 0.5rem) calc(var(--inset-x) * 1rem);
  }

  .row-1, .row-2, .row-3 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .subtitle1 {
    font: var(--font-caption);
    color: var(--color-text-soft);
  }

  .card-header .headline {
    flex-grow: 1;
  }

  .headline {
    color: var(--color-text-strong);
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
    font: var(--font-content-headline-5);
    letter-spacing: var(--letter-spacing-content-headline-5);
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
    margin-left: 0.5rem;
  }

  .subtitle2 {
    font: var(--font-caption);
    color: var(--color-text-soft);
  }

  .subtitle3 {
    font: var(--font-caption-bold);
    color: var(--color-text-strong);
  }
  
  .description {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    color: var(--color-text-soft);
  }

  .row-1,
  .row-3,
  .row-4,
  .description {
    padding-right: calc(var(--inset-x) * 1rem);
  }

  .row-1,
  .headline,
  .row-3,
  .row-4,
  .description {
    padding-bottom: calc(var(--inset-y) * 0.125rem);
  }

  
</style>
