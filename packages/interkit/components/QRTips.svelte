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

  let tipRowStore; // store for all the tips
  let tips; // array with just the tips for this element

  onMount(async () => {
    // setup the subscription to the tip rows
    const tipSheetKey = util.getSheetKey(tipQrKeyColumn);
    tipRowStore = await InterkitClient.getRowSubStore(tipSheetKey);

    // filter tips for targetElement and sort by order column
    tips = $tipRowStore
      .filter(t => 
        util.rowVal(t, tipQrKeyColumn) == util.rowVal(targetElement, elementKeyColumn)
      )
      .sort((a, b) => util.rowVal(a, tipOrderColumn) - util.rowVal(b, tipOrderColumn))  
    console.log("tips", tips)
  })

  let tipIndex = 0;

  const incrIndex = () => {
    if(tipIndex < tips.length - 1) {
       tipIndex += 1;
    } else {
      onClose();
    }
  }

</script>

  {#if tips}
    <MediaFileImage mediafileRef={util.rowVal(tips[tipIndex], tipImageColumn)}/>
    <h1>Hinweis {tipIndex + 1}</h1>
    <p>{util.rowVal(tips[tipIndex], tipTextColumn)}</p>

    {#if tipIndex > 0}<Button text="zurück" onClick={()=>{tipIndex -= 1}}/>{/if}
    <Button text="weiter" onClick={incrIndex}/>
    
  {/if}

<style>



</style>