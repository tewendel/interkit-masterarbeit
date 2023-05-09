<script>

  
</script>

<div class="container">
  <div class="top-bar">
    <slot name="TopBar"></slot>
  </div>
  <div class="content">
    <div class="reset">
      <slot name="Content"></slot>
    </div>
  </div>
  
</div>

<style>

  .container {
    flex-direction: column;
    height: 100%;
    display: flex;
  }

  .content, .top-bar {
    display: flex;
  }

  .top-bar {
    height: 64px;
    border-bottom: var(--border-width) solid var(--border-color);

    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .content {
    flex: 1;
    overflow-y: scroll;
  }

  .reset {
    display: block;
    width: 100%;
    height: 100%;
  }

  

</style>