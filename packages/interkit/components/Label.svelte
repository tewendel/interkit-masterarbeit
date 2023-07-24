<script>
  import Icon from "./Icon.svelte"

  export let variant = "strong"; // strong, normal, soft
  export let type = "text";
  export let icon;
  export let content;
</script>

<span
  class="container {variant} {type}
    Label Label--variant{variant} Label--type{type}
  "
  >
  {#if type == "icon"}<Icon type={icon} inverse height="1rem"/>{/if}
  {#if type == "text"}{content}{/if}
</span>

<style>

  .container {
    box-sizing: border-box;
    white-space: nowrap;
    width: min-content;
    color: var(--color-text-label1);
    margin-right: calc(var(--outset-x) * 0.5rem);
  }

  .container.normal, .container.strong {
    border-radius: 0.5rem;
  }

  .container.normal {
    background-color: var(--color-background-label1);
  }

  .container.text {
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
  }
  
  .container.normal.text,
  .container.strong.text {
    padding:
      calc(var(--inset-y) * 0.125rem)
      calc(var(--inset-x) * 0.5rem);
  }

  .container.icon {
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  } 

  .container.normal.text {
    padding:
      calc(var(--inset-y) * 0.125rem)
      calc(var(--inset-x) * 0.5rem);
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
  }

  .container.strong {
    background-color: var(--color-background-label2);
    color: var(--color-text-label2);
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
  }

  .container.soft {
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
    color: var(--color-text-soft);
    margin-right: calc(var(--outset-x) * 0.25rem);
  }

</style>
