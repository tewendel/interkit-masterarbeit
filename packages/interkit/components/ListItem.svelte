<script>

  import WithEffect from './WithEffect.svelte';
  export let text;
  export let effect;
  
</script>

<WithEffect {effect} let:execute>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="ListItem container {effect ? "withEffect" : ""}"
    class:ListItem--witheffect={!!effect}
    on:click={execute}
    >
    <span class="ListItem__Text text">{#if text}{text}{/if}</span>
    <div class="ListItem__Icon icon-container">
      <slot/>
    </div>
  </div>
</WithEffect>

<style>

  .container {
    width: 100%;
    border-bottom: var(--border-width) solid var(--color-border);
    padding:
      calc(var(--inset-y) * 0.75rem)
      calc(var(--inset-x) * 1rem);
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
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .icon-container {
    justify-self: right;
    align-self: flex-end;
  }

</style>
