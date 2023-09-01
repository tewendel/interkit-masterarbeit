<script>
  import Icon from "./Icon.svelte"
  import FilterControls from "./fragments/FilterControls.svelte";
  import MapLayerOverlay from "./fragments/MapLayerOverlay.svelte";

  export let text;
  export let layerSelectPrompt;
  export let type = "filters" // filters | layers  
  
  let state = "enabled" // enabled | selected

  const toggle = () => {
    if(state == "enabled") {
      state = "selected"
    } else {
      state = "enabled"
    }
    
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="root {state} MapViewButton MapViewButton--state{state}"  on:click={toggle}>
  <Icon type={type == "filters" ? "Thin-Filter" : "Thin-Layer"}/>
  {text ? text : ""}
  <Icon type={state == "enabled" ? "Thin-Dropdown" : "Thin-Dropdown-Up"}/>
</span>

{#if type == "filters" && state == "selected"}
  <FilterControls mainClass="MapViewButton" />
{/if}

{#if type == "layers" && state == "selected"}
  <MapLayerOverlay {layerSelectPrompt} mainClass="MapViewButton"/>
{/if}

<style>

  .root {
    font: var(--font-button);
    letter-spacing: var(--letter-spacing-button);
    border: var(--border-width) solid var(--color-border);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    display: inline-flex;
    padding:
      calc(var(--inset-y) * 0.25rem)
      calc(var(--inset-x) * 0.5rem);
    gap: calc(var(--outset-x) * 0.25rem);
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
  }

  .root.selected {
    background-color: var(--color-background-backdrop);
  }

  .root:active {
    background-color: var(--color-background-button-pressed);
  }


</style>
