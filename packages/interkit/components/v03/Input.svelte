<script>
  export let value
  export let fieldSize = "medium" // small | medium | large
  export let flex = "normal" // normal | fill

</script>

  <input bind:value={value} class="Input size-{fieldSize} flex-{flex} container" {...$$props} />

<style>
  .container {
    padding: var(--distance-s);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    box-shadow: var(--box-shadow);
    text-align: center;
  }

  .size-small {
    height: 32px;
    padding: 0 var(--distance-s);
    font: var(--font-button);
  }

  .size-medium {
    height: 40px;
    padding: 0 var(--distance-m);
    font: var(--font-button);
  }

  .size-large {
    height: 56px;
    padding: 0 var(--distance-s-m);
    font: var(--font-headline-5);
  }

  .flex-fill {
    flex: 1;
  }


</style>