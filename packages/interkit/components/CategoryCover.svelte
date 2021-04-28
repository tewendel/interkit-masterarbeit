<script>
  import { util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'

  export let categoryRow;
  export let titleColumn;
  export let imageColumn;
  export let descriptionColumn;
</script>


<h3>{util.rowVal(category, titleColumn)}</h3>
<MediaFileImage mediafileRef={util.rowVal(category, imageColumn)} />    
<div>{util.rowValString(category, descriptionColumn)}</div>