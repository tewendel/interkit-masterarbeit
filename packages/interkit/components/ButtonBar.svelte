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


<div class="container" style={`justify-content: ${justify}`}>
  <slot/>
</div>
{#if helpText && !hideHelpText}
  <div class="help-text">{helpText}</div>
{/if}

<style>

  .container, .help-text {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 6px;
    box-sizing: border-box;
  }
  
  .help-text {
    font: var(--font-subtitle-2);
    color: var(--color-text-soft);
    letter-spacing: var(--letter-spacing-subtitle-2);
    justify-content: center;
    padding: var(--distance-s);
  }


</style>