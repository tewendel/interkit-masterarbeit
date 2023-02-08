<script>
  export let count = null;
  export let type = "info"; // "warning" | "error" | "info" | "success"
</script>

{#if count}
  <span class="number {type}" >
    {count}
  </span>
{/if}

<style lang="scss">
  
  @use '@carbon/styles/scss/theme';

  .number {
    display: inline-block;
    border-radius: 7px;
    
    color: theme.$text-on-color;
    font-size: 12px;
    min-width: 14px;
    height: 14px;
    text-align: center;
    line-height: 12px;
    padding: 1px 2px 0 2px;
    position: relative;
    top: -10px;
    left: 0px;
  }

  .warning {
    background-color: theme.$support-warning;
  }

  .error {
    background-color: theme.$support-error;
  }

  .success {
    background-color: theme.$support-success;
  }

  .info {
    background-color: theme.$support-info;
  }
</style>