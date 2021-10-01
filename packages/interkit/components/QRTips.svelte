<script>

  import { onMount } from "svelte"
  import { InterkitClient, util } from '../'

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';

  export let targetElement;
  export let elementKeyColumn;

  export let tipQrKeyColumn;
  export let tipImageColumn;
  export let tipTextColumn;
  export let tipOrderColumn;

  export let onClose;

  export let tips; // array with just the tips for this element

  let tipIndex = 0;

  const incrIndex = () => {
    if(tipIndex < tips.length - 1) {
       tipIndex += 1;
    } else {
      onClose();
    }
  }

</script>

  {#if tips?.length}
    <MediaFileImage mediafileRef={util.rowVal(tips[tipIndex], tipImageColumn)}/>
    <h1>Hinweis {tipIndex + 1}</h1>
    <p>{util.rowVal(tips[tipIndex], tipTextColumn)}</p>

    {#if tipIndex > 0}<Button text="zurück" onClick={()=>{tipIndex -= 1}}/>{/if}
    <Button text="weiter" onClick={incrIndex}/>
    
  {:else}

    <p>Für diese Ziel gibt es keine Hinweise.</p>
    <Button text="weiter" onClick={incrIndex}/>

  {/if}

<style>



</style>