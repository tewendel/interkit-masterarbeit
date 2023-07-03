<script>

  import Card from "./Card.svelte"
  import Icon from "../Icon.svelte"
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();

  export let mainClass = ''

  export let layerSelectPrompt = "Choose a layer to display on the map."

  let layers = [];
  if($showDummyData) {
    layers = [
      {
        key: 1,
        headline: "Headline 5",
        description: "This is a special layer.",
        state: "selected"
      },
      {
        key: 2,
        headline: "Headline 5",
        description: "This is a special layer.",
        state: "enabled"
      },
      {
        key: 3,
        headline: "Headline 5",
        description: "This is a special layer.",
        state: "enabled"
      }
    ]
  }

  const selectLayer = (layer) => {
    console.log("selectLayer", layer, layers)
    for(let l of layers) {
      if(l.key == layer.key) {
        l.state = "selected"
      } else {
        l.state = "enabled"
      }
    }
    layers = layers;

  }


</script>



<div class="MapLayerOverlay container {mainClass}">

  <div class="MapLayerOverlay__Info info">
    <Icon type="Thin-Layer"/>
    <span>{layerSelectPrompt}</span>
  </div>

  <div class="MapLayerOverlay__Cards cards">
    {#each layers as layer}
      <Card
        variant="extra-small"
        state={layer.state}
        headline={layer.headline}
        description={layer.description}
        on:click={()=>{selectLayer(layer)}}
        hoverPointer
      />
    {/each}
  </div>

</div>


<style>

  .container {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    z-index: 3;
    margin: 0;
    padding: var(--distance-s);
    background-color: var(--color-background-backdrop);
    border-radius: 0px 0px 32px 32px; 
  }

  .info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: var(--distance-s);
  }

  .info span {
    font: var(--font-subtitle-1);
    letter-spacing: var(--letter-spacing-subtitle-1);
  }
    
</style>
