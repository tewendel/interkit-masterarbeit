<script>

  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let layers;
  export let setLayer;
  export let activeLayer;
  export let elementRows;
  export let isFocused;
  export let onClose;

  export let mainLayerLabel = "Ebenen"

  let layerSelectOpen = false;
  
  const toggleLayers = () => {
    layerSelectOpen = !layerSelectOpen;
    if(!layerSelectOpen && onClose) onClose();
  }  
  const layerSelect = (layer) => {
    layerSelectOpen = false;
    setLayer(layer);
  }
  
  $: if (!isFocused) layerSelectOpen = false // trigger closing

</script>

{#if layers?.length}
  <div id="layerControls" on:click>
    
      <span 
        class="MapLayerControls__Button layerSelectToggle" 
        on:click={toggleLayers}
        class:active={layerSelectOpen}
        >
        <Button nopadding>
          <span class="MapLayerControls__Button__Item button_item">
            <Icon type="layer" height="1em" />
            <span class="label">
              {mainLayerLabel}
            </span>
          </span>
        </Button>
      </span>

      <ul class:active="{layerSelectOpen}">
      {#each layers as layer}
        <li class:active={ activeLayer && layer.name == activeLayer.name}>
          <Button nopadding on:click={()=>{layerSelect(activeLayer && layer.name == activeLayer.name ? null : layer)}}>
            <span class="MapLayerControls__Layers__Item layers_item">
              {layer.name}
            </span>
          </Button>
        </li>
      {/each}
      </ul>

  </div>
{/if}


<style>

  #layerControls {
    font-size: 14px;
    line-height: 20px;
  }

  .active {
    filter: invert(1);
  }

  span.layerSelectToggle, li span, #layerControls div {
    padding: 2px;
  }

  #layerControls span:hover {
    cursor: pointer;
  }

  ul {
    display: flex;
    max-width: 100vw;
    overflow-y: auto;
  }

  li {
    margin: 8px 0;
    white-space: nowrap;
  }

  .button_item,
  .layers_item {
    padding: 8px;
    display: inline-block;
  }

</style>