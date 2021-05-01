<script>

  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  const projectId = INTERKIT_PROJECT_ID

  export let layers;
  export let setLayer;
  export let activeLayer;

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
      console.log(layer.audio)
      audioElementRow = await InterkitClient.call("row.get", {key: activeLayer.audio, projectId})
      console.log("audioElementRow", audioElementRow)
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
    <div>
      {#if $audioPlayerStatus && $audioPlayerStatus.elementRow?.key == audioElementRow?.key}
        <span>(playing)</span>
      {:else}
        <span on:click={()=>{playAudio(audioElementRow)}}>play</span>
      {/if}
      {activeLayer.name}
      <span on:click={()=>layerSelect(null)}>x</span>
    </div>
    
  {:else}
    <span class="layerSelectToggle" on:click={toggleLayers}>layers</span>
    {#if layerSelectOpen}
      <ul>
      {#each layers as layer}
        <li><span on:click={()=>{layerSelect(layer)}}>{layer.name}</span></li>
      {/each}
      </ul>
    {/if}
  {/if}
</div>
{/if}


<style>

  #layerControls {
    position: absolute;
    top: 10px;
    left: 50%;
    width: 100%;
    padding: 10px;
    z-index: 1000;
  }

  span.layerSelectToggle, li span, #layerControls div {
    background-color: white;
    padding: 2px;
  }

  #layerControls span:hover {
    cursor: pointer;
  }

  li {
    margin: 7px;
  }

</style>