<script>

  
  
</script>

<div class="container">
  {#if $$slots.TopBar}
    <div class="top-bar">
      <slot name="TopBar"></slot>
    </div>
  {/if}
  <div class="content">
    <div class="reset">
      <slot name="Content"></slot>
    </div>
  </div>
  {#if $$slots.Player}
    <div class="audio-player">
      <slot name="Player"></slot>
    </div>
  {/if}
  {#if $$slots.BottomBar}
    <div class="bottom-bar">
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
    height: 64px;
    
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .content {
    flex: 1;
    overflow-y: scroll;
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

  .reset {
    display: block;
    width: 100%;
    height: 100%;
  }

</style>