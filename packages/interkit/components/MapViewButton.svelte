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
<span class="{state} MapViewButton MapViewButton--state{state}"  on:click={toggle}>
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

  span {
    font: var(--font-button);
    border: var(--border-width) solid var(--color-border);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    display: inline-flex;
    padding: var(--distance-xs) var(--distance-s); 
    gap: var(--distance-xs);
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

  span.selected {
    background-color: var(--color-background-backdrop);
  }

  span:active {
    background-color: var(--color-background-button-pressed);
  }


</style>
