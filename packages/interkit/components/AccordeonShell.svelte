<script>

  import Icon from "./Icon.svelte"

  let state = "closed" // open | closed

  const toggleState = () => {
    if (state === "closed") 
      state = "open"
    else 
      state = "closed"
  }

</script>

<div class="AccordeonShell container {state} root">

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="AccordeonShell__header header" on:click={toggleState}>
    <div class="AccordeonShell__label label">
      <slot name="label"/>
    </div>
    <div class="AccordeonShell__toggle toggle">
      <Icon type={state == "closed" ? "Thin-Chevron-Down" : "Thin-Chevron-Up"}/>
    </div>
  </div>

  <div class="AccordeonShell__content content">
    <slot name="content"/>
  </div>

</div>

<style>

  .root {
    --border-radius-accordeonshell: calc(var(--border-radius) - 0.5rem);
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--color-background);
    box-shadow: var(--box-shadow);
    box-sizing: border-box;
    border-radius: var(--border-radius-accordeonshell);
  }
  
  .label,
  .toggle {
    display: flex;
    align-items: center;
  }

  .label {
    padding:
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 0.5rem);
    flex-grow: 1;
    gap: calc(var(--inset-x) * 0.5rem);
  }

  .toggle {
    padding: var(--distance-xs);
    border-radius: 0 var(--border-radius-accordeonshell) 0 0; 
  }

  .container.closed .content {
    display: none;
  }

  .content {
    background-color: var(--color-background-backdrop);
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
    border-radius: 0 0 var(--border-radius-accordeonshell) var(--border-radius-accordeonshell); 
    padding:
      calc(var(--inset-y) * 1rem)
      calc(var(--inset-x) * 1rem);
    display: flex;
    flex-direction: column;
    gap: calc(var(--inset-y) * 1rem);
  }

  .container.open .header {
    border-radius: var(--border-radius-accordeonshell) var(--border-radius-accordeonshell) 0 0; 
  }

  .container.open .toggle {
    background-color: var(--color-background-highlight);
  }

</style>
