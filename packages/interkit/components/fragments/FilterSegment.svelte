<script>
  import Icon from "../Icon.svelte"

  export let text
  export let state // enabled | selected
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click class="FilterSegment Filtersegment--state{state} {state}">{text}{#if state == "selected"}<Icon type="Thin-Close" height="16px"/>{/if}</span>

<style>

  span {
    display: inline-flex;
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px; 
    border-radius: var(--border-radius-button);
    border: var(--border-width) solid var(--color-border);
    background-color: var(--color-background-button);
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
    white-space: nowrap;
  }

  span.selected {
    background-color: var(--color-background-button-pressed);
  }

  span:hover {
    cursor: pointer;
  }

</style>
