<script>
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'
  
  export let label
  export let headline
  export let prompt

  export let size = "full" // full | large | medium

  let showDummyData =  getShowDummyDataStore();
  if($showDummyData) {
    label = "Label"
    headline = "Headline"
    prompt = "Lorem Ipsum Prompt"
  }

</script>

<div class="ModalHeader container {size}">

  {#if label || $showDummyData}<div class="Modalheader__Label label">{label}</div>{/if}
  {#if headline || $showDummyData}<div class="ModalHeader__Headline headline">{headline}</div>{/if}
  {#if prompt || $showDummyData}<div class="ModalHeader__Prompt prompt">{prompt}</div>{/if}

</div>

<style>

  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--distance-xs); 
  }

  .label {
    font: var(--font-caption);
    color: var(--color-text-soft);
  }

  .container.full .headline {
    font: var(--font-headline-2);
    letter-spacing: var(--letter-spacing-headline-2);
  }

  .container.large .headline {
    font: var(--font-headline-3);
    letter-spacing: var(--letter-spacing-headline-3);
  }

  .container.medium .headline {
    font: var(--font-headline-4);
    letter-spacing: var(--letter-spacing-headline-4);
  }

  .prompt {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    color: var(--color-text-soft);
  }

</style>
