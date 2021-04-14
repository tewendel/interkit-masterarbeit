<script>

  import { util } from '../'
  import MediaFileImage from './MediaFileImage.svelte';
  import { playAudio } from './AudioPlayer.svelte'
  
  export let title;
  export let elementRows;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;
  export let imageColumn;

  const play = async (element) => {
    await playAudio(util.rowVal(element, audioColumn).value, util.rowVal(element, titleColumn))
  }

</script>

<h3>{title}</h3>

<div class="slider-container">
  {#each elementRows as element}
    <div>    
      <MediaFileImage mediafileRef={util.rowVal(element, imageColumn)}/><br>
      <h4>{util.rowVal(element, titleColumn)}</h4>
      <div>{util.rowVal(element, descriptionColumn)}</div>
      <button on:click={()=>{play(element)}}>play</button>
    </div>
  {/each}
</div>


<style> 

  .slider-container {
    display: flex;
  }

  .slider-container > div {
    border: 1px solid gray;
    padding: 5px;
    
  }


</style>