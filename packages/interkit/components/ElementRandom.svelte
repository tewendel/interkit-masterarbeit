<script>

  import { util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  
  export let elementRows;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;

  export let image;
  export let title;
  
  const play = async () => {
    let randomIndex = Math.floor(elementRows.length * Math.random())
    let elementRow = elementRows[randomIndex]
    await playAudio(util.rowVal(elementRow, audioColumn).value, util.rowVal(elementRow, titleColumn))
  }

</script>

<div on:click={play}>    
  <MediaFileImage mediafileRef={image} />    
  <h3>{title}</h3>
</div>

<style> 

  

</style>
