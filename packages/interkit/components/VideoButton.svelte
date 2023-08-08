<script>

  import { getContext } from 'svelte'
  import Button from "./Button.svelte"
  import Icon from './Icon.svelte';
  import MediaFileResolver from './MediaFileResolver.svelte';
  import Overlay from './Overlay.svelte';
  import { util } from '../'

  export let videoColumn
  export let mediafileKey
  export let controls = "none" // interkit | native | none
  export let loop = false

  export let buttonText
  export let buttonType
  export let buttonSize
  export let buttonFlex
  
  const elementContext = getContext("element")
  if(!elementContext) {
    console.warn("VideoButton needs an element context, for example from DataLoaderSingle")
  }

  let videoFileRef;
  $: {
    if(mediafileKey) videoFileRef = {value: mediafileKey}
    if(videoColumn) videoFileRef = util.rowVal($elementContext, videoColumn)
    //console.log("videoFileRef", videoFileRef)
  }
  

  let playerOpen = false;

  const openPlayer = () => playerOpen = true;
  const closePlayer = () => playerOpen = false;
    

</script>

{#if playerOpen}

  <Overlay classes="VideoPlayer" customStyle="background-color: #000;">

    <div class="VideoPlayer__Close close">
      <Button size="small" on:click={closePlayer}>
        <Icon type="Full-Close"/>
      </Button>
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay controls={controls == "native"} {loop}>
      <MediaFileResolver let:url mediafileRef={videoFileRef} >
        <source src={url} >
      </MediaFileResolver>
    </video>

    {#if controls == "interkit"}

    


    {/if}

  </Overlay>

{:else}

  <Button text={buttonText} type={buttonType} size={buttonSize} flex={buttonFlex} on:click={openPlayer} mainClass="PopoutAudioButton">
      <slot name="buttonIcon"/>
  </Button>

{/if}

<style>

  .close {
    position: absolute;
    top: var(--distance-s);
    left: var(--distance-s);
  }

  video {
    width: 100%;
    height: 100%;
  }

</style>
