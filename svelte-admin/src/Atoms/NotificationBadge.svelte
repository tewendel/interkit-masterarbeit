<script>

  import { Loading } from 'carbon-components-svelte'

  export let count = null;
  export let type = "info"; // "warning" | "error" | "info" | "success"
  export let posAbs = false;
  export let loading = false;
  export let placeholder = false;

</script>
<span class="NotificationBadge {count || loading ? '' : 'zero'} {posAbs ? 'absolute' : 'inline'} {placeholder ? 'placeholder' : ''}" >
  {#if count && !loading}
    <span class="badge {type}">
      <span class="number">{count}</span>
    </span>
  {/if}
  {#if loading}
    <div class="loading">
      <Loading withOverlay={false} small />
    </div>
  {/if}
  {#if !count && !loading && placeholder}
    <span class="placeholder"></span>
  {/if}
</span>


<style lang="scss">
  
  @use '@carbon/styles/scss/theme';

  .NotificationBadge {
    font-size: 1rem;
    min-width: 1rem;
    height: 1rem;
    display: inline-block;
  }

  .badge {
    box-sizing: border-box;
    display: inline-block;
    border-radius: 0.5rem;
    min-width: 1rem;
    height: 1rem;
    text-align: center;
    line-height: 1;
    padding: 0.2em 0.25em 0 0.25em;
    color: theme.$text-on-color;
  }

  .placeholder {
    display: inline-block;
    width: 1rem;
    height: 1rem;
  }

  .number {
    font-size: 66.67%;
    vertical-align: top;
  }

  .inline {
    vertical-align: middle;
    position: relative;
    top: -.1ex;
    left: 0px;
  }

  .absolute {
    position: absolute;
    right: 0.2em;
    top: 0.2em;
  }

  .loading {
    display: inline-block;
    vertical-align: middle;
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

  .zero.placeholder {
    background-color: transparent;
  }

  .zero:not(.placeholder) {
    display: none;
  }

</style>
