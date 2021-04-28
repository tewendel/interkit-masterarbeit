<script>
  import { util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'

  export let categoryRow;
  export let titleColumn;
  export let imageColumn;
  export let descriptionColumn;
</script>


<MediaFileImage mediafileRef={util.rowVal(categoryRow, imageColumn)} />    
<h3>{util.rowVal(categoryRow, titleColumn)}</h3>
<div>{util.rowValString(categoryRow, descriptionColumn)}</div>