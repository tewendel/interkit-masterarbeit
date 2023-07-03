<script>

  import Icon from "./Icon.svelte"

  let state = "closed" // open | closed

  const toggelState = () => {
    if(state == "closed") 
      state = "open"
    else 
      state = "closed"
  }

</script>

<div class="AccordeonShell container {state}">

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header" on:click={toggelState}>
    <div class="label">
      <slot name="label"/>
    </div>
    <div class="toggle">
      <Icon type={state == "closed" ? "Thin-Chevron-Down" : "Thin-Chevron-Up"}/>
    </div>
  </div>

  <div class="content">
    <slot name="content"/>
  </div>

</div>

<style>

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--color-background);
    box-shadow: var(--box-shadow);
    box-sizing: border-box;
    border-radius: calc(var(--border-radius) - 8px);
  }
  
  .label, .toggle {
    display: flex;
    align-items: center;
  }

  .label {
    padding: var(--distance-s);
    flex-grow: 1;
    gap: var(--distance-s);
  }

  .toggle {
    padding: var(--distance-xs);
    border-radius: 0px calc(var(--border-radius) - 8px) 0px 0px; 
  }

  .container.closed .content {
    display: none;
  }

  .content {
    background-color: var(--color-background-backdrop);
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
    border-radius: 0 0 calc(var(--border-radius) - 8px) calc(var(--border-radius) - 8px);
    padding: var(--distance-m);
    display: flex;
    flex-direction: column;
    gap: var(--distance-m);
  }

  .container.open .header {
    border-radius: calc(var(--border-radius) - 8px) calc(var(--border-radius) - 8px) 0 0;
  }

  .container.open .toggle {
    background-color: var(--color-background-highlight);
  }




</style>