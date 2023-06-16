<script>
  import Icon from "./Icon.svelte"

  export let variant = "strong"; // strong, normal, soft
  export let type = "text";
  export let icon;
  export let content;
</script>

<span class="container {variant} {type}">
  {#if type == "icon"}<Icon type={icon} inverse height="16px"/>{/if}
  {#if type == "text"}{content}{/if}
</span>

<style>

  .container {
    height: 20px;
    box-sizing: border-box;
  }

  .container.normal, .container.strong {
    border-radius: 8px;
  }

  .container.normal {
    background-color: #B2B2B2;
    margin-right: 4px;
  }

  .container.text {
    font: var(--font-caption-bold);
  }
  
  .container.normal.text, .container.strong.text {
    padding: 2px 8px;
  }

  .container.icon {
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  } 

  .container.normal.text {
    padding: 2px 8px;
    font: var(--font-caption-bold);
  }

  .container.strong {
    background: #000000;
    color: #FFFFFF;
    font: var(--font-caption-bold);
    margin-right: 4px;
  }

  .container.soft {
    font: var(--font-caption-bold);
    color: #808080;
    margin-right: 8px;
  }

</style>