<script>

  import ModalHeader from "./fragments/ModalHeader.svelte"
  import Icon from "./Icon.svelte"
  import ButtonBar from "./ButtonBar.svelte"
  import WithEffect from "./WithEffect.svelte";

  export let variant = "oneline" // oneline | informative | responseNeeded
  export let label
  export let headline
  export let prompt
  export let effect

</script>

<WithEffect {effect} let:execute>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="Snackbar Snackbar--variant{variant} container {variant}" class:effect on:click={execute}>

    <div class="header Snackbar__Header">
      <ModalHeader 
        size="medium"
        label={variant != "oneline" ? label : undefined}
        headline={variant != "oneline" ? headline : undefined}
        {prompt}
      />
    </div>

    {#if variant == "oneline" || variant == "informative"}
      <div class="close Snackbar__Close">
        <Icon type="Full-Close"/>
      </div>
    {/if}

    {#if variant == "responseNeeded"}
      <div class="buttons Snackbar__Buttons">
        <ButtonBar hideHelpText>
          <slot name ="buttons"/>
        </ButtonBar>
      </div>
    {/if}

  </div>
</WithEffect> 

<style>

  .container {
    background-color: var(--color-background-highlight);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding:
      calc(var(--inset-y) * 1rem)
      calc(var(--inset-x) * 1rem);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: calc(var(--inset-y) * 0.5rem);
  }

  .container.effect:hover {
    cursor:pointer;
  }

  .container.oneline {
    flex-direction: row;
    align-items: center;
  }

  .container.oneline .header {
    flex-grow: 1;
  }

  .container.informative {
    flex-direction: row;
    align-items: flex-start;
  }

  .container.informative .header {
    flex-grow: 1;
  }
  
</style>
