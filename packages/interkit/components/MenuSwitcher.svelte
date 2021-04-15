<script>
  import MediaFileImage from './MediaFileImage.svelte'
  import { InterkitClient, util } from '../'

  export let title;
  export let image;

  const doSwitch = ()=> {
    InterkitClient.callGlobalMethod("menuSwitcherTarget")
  }

</script>

<div on:click={doSwitch}>
  <h3>{title}</h3>
  <MediaFileImage mediafileRef={image} />    
</div>
