<script>

  import WithEffect from './WithEffect.svelte';
  export let text;
  export let effect;
  
</script>

<WithEffect {effect} let:execute>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="container {effect ? "withEffect" : ""}" on:click={execute}>
    <span class="text">{text}</span>
    <div class="icon-container">
      <slot/>
    </div>
  </div>
</WithEffect>

<style>

  .container {
    width: 100%;
    border-bottom: var(--border-width) solid var(--color-border);
    padding: 12px 16px 12px 16px;
    display: flex;
    box-sizing: border-box;
  }

  .container.withEffect:hover {
    cursor: pointer;
  }

  .text {
    font: var(--font-subtitle-1);
    letter-spacing: var(--letter-spacing-subtitle-1);
    flex: 1;
  }

  .icon-container {
    justify-self: right;
    align-self: flex-end;
  }

</style>
