<script>

  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  export let layers;
  export let setLayer;
  export let activeLayer;
  export let elementRows;
  export let isFocused;

  let layerSelectOpen = false;
  let audioElementRow;
  
  const toggleLayers = () => {
    layerSelectOpen = !layerSelectOpen;
  }  
  const layerSelect = (layer) => {
    layerSelectOpen = false;
    setLayer(layer);
  }
  const loadAudioElement = async (layer) => {
    if(layer?.audio) {
      //console.log(layer.audio)
      audioElementRow = elementRows.find(r => r.key == activeLayer.audio)
      //console.log("audioElementRow", audioElementRow)
      // autoplay on layer select
      /*if(audioElementRow) {
        playAudio(audioElementRow);
      }*/
    }
  }
  $: loadAudioElement(activeLayer)

  $: if (!isFocused) layerSelectOpen = false // trigger closing

</script>

{#if activeLayer}
  <div class="MapLayerControls__ActiveLayer active_layer active">
    <Button nopadding>
      <span class="MapLayerControls__ActiveLayer__Item active_layer_item">
        <span class="label">
          {#if audioElementRow}
            {#if $audioPlayerStatus && $audioPlayerStatus.elementRow?.key == audioElementRow?.key}
              <span>(playing)</span>
            {:else}
              <span on:click={()=>{playAudio(audioElementRow)}}>play</span>
            {/if}
          {/if}
          {activeLayer.name}
        </span>
        <Icon type="close" height="1em" on:click={()=>layerSelect(null)} />
      </span>
    </Button>
  </div>
{/if}

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
              Ebenen
            </span>
          </span>
        </Button>
      </span>

      {#if layerSelectOpen}
        <ul>
        {#each layers as layer}
          <li class:active={ activeLayer && layer.name == activeLayer.name}>
            <Button on:click={()=>{layerSelect(activeLayer && layer.name == activeLayer.name ? null : layer)}}>
              <span class="MapLayerControls__Layers__Item layers_item">
                {layer.name}
              </span>
            </Button>
          </li>
        {/each}
        </ul>
      {/if}

  </div>
{/if}


<style>

  #layerControls {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    left: 55px;
    bottom: 55px;
    z-index: 1000;
  }

  .active_layer {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1000;
  }

  .active_layer_item .label {
    max-width: calc(50vw - 64px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
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

  li {
    margin: 8px 0;
  }

  .button_item,
  .active_layer_item,
  .layers_item {
    padding: 8px;
    display: inline-block;
  }

</style>