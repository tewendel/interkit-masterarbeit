<script>

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store'
  import { util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import ButtonBar from './ButtonBar.svelte'
  import MediaFileResolver from './MediaFileResolver.svelte'
  
  export let element; // alaways use prop
  
  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(element)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(element)

  export let imageColumn
  export let audioColumn
  export let videoColumn
  export let titleColumn

  $: imageRef = util.rowVal(element, imageColumn)
  $: audioRef = util.rowVal(element, audioColumn)
  $: videoRef = util.rowVal(element, videoColumn)
  $: title    = util.rowVal(element, titleColumn)
  
</script>

{#if element}

  <section title={title || ""}>

    <AspectRatio standalone aspectRatio={1} >

      {#if imageRef}
        <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
      {/if}
      
      {#if audioRef}
        <MediaFileResolver mediafileRef={audioRef} let:url>
          <audio controls src={url} />
        </MediaFileResolver>
      {/if}

      {#if videoRef}
        <MediaFileResolver mediafileRef={videoRef} let:url>
          <video controls src={url} />
        </MediaFileResolver>
      {/if}
      
    </AspectRatio>

  </section>

{/if}

<style>
  section {
    padding: 0 var(--distance-s) var(--distance-s) var(--distance-s);
  }

  video {
    object-fit: cover;    
    width:100%;
    height: 100%;
  }
</style>
