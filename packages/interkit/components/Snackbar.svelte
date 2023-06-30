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
  <div class="Snackbar container {variant}" class:effect on:click={execute}>

    <div class="header">
      <ModalHeader 
        size="medium"
        label={variant != "oneline" ? label : undefined}
        headline={variant != "oneline" ? headline : undefined}
        {prompt}
      />
    </div>

    {#if variant == "oneline" || variant == "informative"}
      <div class="close">
        <Icon type="Full-Close"/>
      </div>
    {/if}

    {#if variant == "responseNeeded"}
      <div class="buttons">
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
    padding: var(--distance-s);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--distance-s);
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