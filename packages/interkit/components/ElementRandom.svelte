<script>

  import { util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  
  export let title;
  export let image;
  
  export let elementRows;
  export let elementColumns;

  
  const play = async () => {
    let randomIndex = Math.floor(elementRows.length * Math.random())
    let elementRow = elementRows[randomIndex]
    console.log(elementRow)
    await playAudio(util.rowVal(elementRow, elementColumns.audioColumn)?.value, util.rowVal(elementRow, elementColumns.titleColumn))
  }

</script>

<div on:click={play}>    
  <MediaFileImage mediafileRef={image} />    
  <h3>{title}</h3>
</div>

<style> 

  

</style>
