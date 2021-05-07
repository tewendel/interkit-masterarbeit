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

</script>

{#if layers?.length}
  <div id="layerControls">
    
    {#if activeLayer}
      <div class="MapLayerControls__ActiveLayer active_layer">
        <Button>
          {#if audioElementRow}
            {#if $audioPlayerStatus && $audioPlayerStatus.elementRow?.key == audioElementRow?.key}
              <span>(playing)</span>
            {:else}
              <span on:click={()=>{playAudio(audioElementRow)}}>play</span>
            {/if}
          {/if}
          {activeLayer.name}
          <Icon type="close" height="1em" on:click={()=>layerSelect(null)} />
        </Button>
      </div>
    {/if}

      <span class="layerSelectToggle" on:click={toggleLayers}>
        <Button>
          <Icon type="layer" height="1em" />
          layers
        </Button>
      </span>
      {#if layerSelectOpen}
        <ul>
        {#each layers as layer}
          <li>
            <Button on:click={()=>{layerSelect(layer)}}>
              {layer.name}
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
    place-items: flex-end;
  }

  .active_layer {
    position: absolute;
    top: 16px;
  }

  span.layerSelectToggle, li span, #layerControls div {
    padding: 2px;
  }

  #layerControls span:hover {
    cursor: pointer;
  }

  li {
    margin: 7px;
  }

</style>