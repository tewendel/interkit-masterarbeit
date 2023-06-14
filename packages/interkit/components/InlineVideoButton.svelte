<script>
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Overlay from './Overlay.svelte';
  import InlineVideoPlayer from './InlineVideoPlayer.svelte';
  let showVideoOverlay = false;
</script>

<Button size="medium" type="primary" on:click={()=>{showVideoOverlay = true}}>
  <Icon type="Full-Play" inverse></Icon>
    Play Video
</Button>

{#if showVideoOverlay}
<Overlay customStyle="background-color: black;">
  <div class="video-close-button" on:click={()=>{showVideoOverlay=false}}>
    <Button>
      <Icon type="close"/>
    </Button>
  </div>
  <InlineVideoPlayer autoplay mediafileKey={slides[slideIndex]?.video?.value}/>
</Overlay>
{/if}
