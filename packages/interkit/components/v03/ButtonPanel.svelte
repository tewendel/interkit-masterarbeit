<script>
  export let infoText
  export let style
</script>

<div class="ButtonPanel container" {style}>
  <div class="buttons">
    <slot/>
  </div>
  <p class="infoText">
    {#if infoText}
      {infoText}
    {/if}
  </p>
</div>

<style>

  .container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    display: inline-flex;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .buttons {
    padding: var(--distance-s) var(--distance-xl);
    display: flex;
    justify-content: center;
  }

  .infoText:not(:empty) {
    text-align: center;
    font: var(--font-caption);
    padding: 0 var(--distance-s) var(--distance-s) var(--distance-s);
  }

</style>