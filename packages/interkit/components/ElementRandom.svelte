<script>

  import { util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  
  export let elementRows;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;
  
  const play = async () => {
    let randomIndex = Math.floor(elementRows.length * Math.random())
    let elementRow = elementRows[randomIndex]
    await playAudio(util.rowVal(elementRow, audioColumn).value, util.rowVal(elementRow, titleColumn))
  }

</script>

<div>    
  <button on:click={play}>shuffle!!</button>
</div>

<style> 

  

</style>
