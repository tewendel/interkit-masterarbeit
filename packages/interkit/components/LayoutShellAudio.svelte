<script>  

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
    height: 56px;
    
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .content {
    flex: 1;
    overflow-y: hidden;
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .audio-player {    
    max-height: 64px;
  }
  
  .bottom-bar {
    height: 64px;
    
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  
</style>
