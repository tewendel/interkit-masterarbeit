<script>

  import { util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  
  export let elementRow;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;
  //export let imageColumn;

  const play = async () => {
    await playAudio(util.rowVal(elementRow, audioColumn).value, util.rowVal(elementRow, titleColumn))
  }

</script>

<div class="ElementSingle container">    
  <h3 class="ElementSingle__headline headline">{util.rowVal(elementRow, titleColumn)}</h3>
  <button on:click={play}>play</button>
</div>

<style> 
  .container {}
  .headline {}
</style>