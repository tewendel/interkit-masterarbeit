<script>

  import { util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  
  export let title;
  export let image;
  
  export let elementRows;
  export let elementColumns;

  // exclude rows without an audio and an image
  const rowFilter = (row) => {
    if(!util.rowVal(row, elementColumns.audioColumn)) return false;
    if(!util.rowVal(row, elementColumns.imageColumn)) return false;
    return true;
  }

  const play = async () => {
    let rowsFiltered = elementRows.filter(rowFilter);
    let randomIndex = Math.floor(rowsFiltered.length * Math.random())
    let elementRow = rowsFiltered[randomIndex]
    console.log(elementRow)
    await playAudio(elementRow)
  }

</script>

<div on:click={play}>    
  <MediaFileImage mediafileRef={image} />    
  <h3>{title}</h3>
</div>

<style> 

  

</style>
