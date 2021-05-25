<script>

  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import AudioPlayButton from './AudioPlayButton.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  
  export let activeFilter
  export let setFilter
  export let activeLayer
  export let setLayer
  export let elementRows;

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

  let audioElementRow;
  
  const loadAudioElement = async (layer) => {
    //console.log("layer", layer)
    if(layer?.audio) {
      console.log(layer.audio, elementRows)
      audioElementRow = elementRows.find(r => r.key == layer.audio)
      console.log("audioElementRow", audioElementRow)
      // autoplay on layer select
      /*if(audioElementRow) {
        playAudio(audioElementRow);
      }*/
    } else {
      audioElementRow = null;
    }
  }
  $: loadAudioElement(activeLayer)


</script>

<div class="Map__ActiveLabels active_labels">

  {#if activeFilter}
      <span class="Map__ActiveFilter active_filter active">
        <Button nopadding>
          <span class="Map__ActiveFilter__Item active_filter_item">
            <span class="label">
              {activeFilter.name}
            </span>
            <Icon type="close" height="1em" on:click={()=>setFilter(null)} />
          </span>
        </Button>
      </span>
    {/if}

  {#if activeLayer}
    <div class="Map__ActiveLayer active_layer active">
      <Button nopadding>
        <span class="Map__ActiveLayer__Item active_layer_item">
          {#if audioElementRow}
            <AudioPlayButton
              playing={$audioPlayerStatus && $audioPlayerStatus.elementRow?.key == audioElementRow?.key}
              onTap={()=>{playAudio(audioElementRow)}}
              paused={$audioPlayerStatus?.paused}
            />
          {/if}
          <span class="Map__ActiveLayer__Item__Label active_layer_item_label">{activeLayer.name}</span>
          <Icon type="close" height="1em" on:click={()=>setLayer(null)} />
        </span>
      </Button>
    </div>
  {/if}

</div>



<style>

  .active_labels {
    position: absolute;
    width: 100%;
    top: 16px;
    left: 16px;
    z-index: 1000;
    filter: invert(1);
    display: flex;
    flex-direction: column;
  }

  .active_layer, .active_filter {
    margin-bottom: 8px;
  }

  .active_filter_item, .active_layer_item {
    padding: 8px;
    display: inline-block;
  }

  .active_layer_item .label, .active_filter_item .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  

</style>