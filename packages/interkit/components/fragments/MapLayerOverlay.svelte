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
    <Icon type="Full-Layer"/>
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
    --mapoverlay-top: calc(var(--outset-y) * 1rem + var(--inset-y) * 0.5rem + 2rem);
    --mapoverlay-inset: calc(var(--inset) * 0.5rem);
    /* will contain cards... */
    --mapoverlay-border-radius: calc(var(--border-radius-outer) + var(--mapoverlay-inset));
    position: fixed;
    top: var(--mapoverlay-top);
    left: 0;
    right: 0;
    z-index: 2003; /* must be above map marker popup */
    margin: 0;
    background-color: var(--color-background-backdrop);
    /* FIXME: this looks weird when there is enough cards to scroll.
     * would be very complicated to fix properly. */
    border-radius:
      0
      0
      var(--mapoverlay-border-radius)
      var(--mapoverlay-border-radius);
    box-sizing: border-box;
    max-height: calc(100% - var(--mapoverlay-top));
    display: flex;
    flex-direction: column;
  }

  .info {
    display: flex;
    align-items: center;
    gap: calc(var(--inset-x) * 1rem);
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 1rem);
  }

  .info span {
    font: var(--font-subtitle-1);
    letter-spacing: var(--letter-spacing-subtitle-1);
  }

  .cards {
    flex-grow: 1;
    overflow-y: auto;
    padding: var(--mapoverlay-inset);
    /*
    display: flex;
    flex-direction: column;
    gap: var(--distance-s);
    */
  }
    
</style>
