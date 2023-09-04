<script>

  import Card from "./Card.svelte"
  import Icon from "../Icon.svelte"
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();

  export let mainClass = ''

  export let layerSelectPrompt = "Choose a layer to display on the map."
  export  let layers = [];
  export let updateActiveViews  

  const update = () => {
    updateActiveViews(layers.filter(f => f.state == "selected"), "activeLayers")
  }

  if($showDummyData) {
    layers = [
      {
        key: 1,
        titleColumn: "Headline 5",
        descriptionColumn: "This is a special layer.",
        state: "selected"
      },
      {
        key: 2,
        heatitleColumndline: "Headline 5",
        descriptionColumn: "This is a special layer.",
        state: "enabled"
      },
      {
        key: 3,
        titleColumn: "Headline 5",
        descriptionColumn: "This is a special layer.",
        state: "enabled"
      }
    ]
    update()
  }

  const selectLayer = (layer) => {
    //console.log("selectLayer", layer, layers)
    for(let l of layers) {
      if(l.key == layer.key && l.state != "selected") {
        l.state = "selected"
      } else {
        l.state = "enabled"
      }
    }
    layers = layers;
    update()
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
        headline={layer.titleColumn}
        description={layer.descriptionColumn}
        label3={layer.labelColumn}
        subtitle3={layer.subtitleColumn}
        imageRef={layer.imageColumn}
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
    max-height: calc(100% - 56px); /* 56px == LayoutShell .top-bar height */
    overflow-y: auto;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: var(--distance-s);
    padding: 0 var(--distance-s);
  }

  .info span {
    font: var(--font-subtitle-1);
    letter-spacing: var(--letter-spacing-subtitle-1);
  }

  .cards {
    /*
    display: flex;
    flex-direction: column;
    gap: var(--distance-s);
    */
  }
    
</style>
