<script>

  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();

  export let justify = "center"
  export let helpText;
  export let hideHelpText = false;

  if($showDummyData) {
    helpText = "helpText"
  }

</script>


<div
  class={`ButtonBar ButtonBar__justify${justify} container`}
  style={`justify-content: ${justify}`}
  >
  <slot/>
</div>
{#if helpText && !hideHelpText}
  <div class="ButtonBar__HelpText help-text">{helpText}</div>
{/if}

<style>

  .container,
  .help-text {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: calc(var(--outset-x) * 0.375rem);
    box-sizing: border-box;
  }
  
  .help-text {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    color: var(--color-text-soft);
    justify-content: center;
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--inset-x) * 0.5rem);
  }


</style>
