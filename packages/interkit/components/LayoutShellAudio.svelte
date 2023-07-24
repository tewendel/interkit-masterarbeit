<script>  

  // TODO: make this component properly abstract to match its usage
  export let mainClass = 'LayoutShellAudio' 
  
</script>

<div class={`${mainClass} container`}>
  {#if $$slots.TopBar}
    <div class={`${mainClass}__TopBar top-bar`}>
      <slot name="TopBar"></slot>
    </div>
  {/if}
  <div class={`${mainClass}__Content content`}>
      <slot name="Content"></slot>    
  </div>
  {#if $$slots.Player}
    <div class={`${mainClass}__AudioPlayer audio-player`}>
      <slot name="Player"></slot>
    </div>
  {/if}
  {#if $$slots.BottomBar}
    <div class={`${mainClass}__BottomBar bottom-bar`}>
      <slot name="BottomBar"></slot>
    </div>
  {/if}
</div>

<style>

  .container {
    flex-direction: column;
    height: 100%;
    display: flex;
  }

  .content, .top-bar, .bottom-bar {
    display: flex;
  }

  .top-bar {
    /* min-height: 3.5rem; */
    flex-shrink: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .content {
    overflow-y: hidden;
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .audio-player {    
    /* max-height: 4rem; */
    flex-shrink: 1;
  }
  
  .bottom-bar {
    /* min-height: 4rem; */
    
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  
</style>
