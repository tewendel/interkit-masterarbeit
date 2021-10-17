<script>

  import { onMount } from "svelte"
  import { InterkitClient, util } from '../'

  import Button from './Button.svelte';
  import MediaFileImage from './MediaFileImage.svelte';

  import MapRenderer from './MapRenderer.svelte'
  import MultiStepContent from './MultiStepContent.svelte'

  export let onClose;

  export let tips; // array with just the tips for this element
  export let targetElementObj;

</script>

  <div class="center-box">
  
      <MultiStepContent
        slides = {tips}
        {onClose}
      />
        
  </div>

  <div class="map">

    <MapRenderer
      height="100%"
      showControls="FALSE"
      mapId="qr-map"
      markerData={[]}
      mapFocus={targetElementObj.elementLocationColumn}
    />


  </div>


<style>

  .center-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1000;
    pointer-events: none;
  }

  .container {
    margin-left: 16px;
    margin-right: 16px;
    border: 1px solid black;
    border-radius: var(--border-radius);
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    z-index: 1000;
  }

  .map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }



</style>
