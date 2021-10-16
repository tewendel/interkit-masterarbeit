<script>
  export let value

</script>

<input bind:value={value} class="Input container" {...$$props} />

<style>
  .container {
    padding: 16px 8px 8px 8px;
    border: 1px solid rgba(0, 0, 0, 0.87);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    box-shadow: var(--box-shadow);
    text-align: center;
  }
</style>