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

  <div class="center-box">
  
    <div class="container">

      {#if tips?.length}
        
        <div class="image">
          <MediaFileImage mediafileRef={util.rowVal(tips[tipIndex], tipImageColumn)}/>
        </div>
        
        <h1>Hinweis {tipIndex + 1}</h1>
        <p>{util.rowVal(tips[tipIndex], tipTextColumn)}</p>

        <div class="QRTips__Button__Bar button-bar">
          {#if tipIndex > 0}<Button text="Zurück" onClick={()=>{tipIndex -= 1}}/>{/if}
          <Button text="Weiter" onClick={incrIndex}/>
        </div>
        
      {:else}

        <p>Für diese Ziel gibt es keine Hinweise.</p>
        <Button text="Weiter" onClick={incrIndex}/>

      {/if}

    </div>

  </div>

<style>

  .center-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .container {
    margin-left: 16px;
    margin-right: 16px;
    border: 1px solid black;
    border-radius: 25px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container .image {
    border: 1px solid black;
    border-radius: 25px;
    overflow: hidden;
    width: 100%;
    margin-bottom: 16px;
    max-height: 200px;
  }

  h1, p {
    text-align: center;
  }

  h1 {
    font-size: var(--font-size-headline-1);
    margin-bottom: 16px;
  }

  p {
    font-size: var(--font-size-regular);
    line-height: var(--line-height-regular);
    margin-bottom: 16px;
    width: 80%;
  }

  .button-bar {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
  }

  :global(.QRTips__Button__Bar span:not(:first-child)) {
    margin-left: 8px;
  }



</style>