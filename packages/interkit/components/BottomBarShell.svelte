<script>

  
</script>

<div class="container">
  <div class="content">
    <div class="reset">
      <slot name="Content"></slot>
    </div>
  </div>
  <div class="bottom-bar">
    <slot name="BottomBar"></slot>
  </div>
</div>

<style>

  .container {
    flex-direction: column;
    height: 100%;
    display: flex;
  }

  .content, .bottom-bar {
    display: flex;
  }

  .content {
    flex: 1;
    overflow-y: scroll;
  }

  .reset {
    display: block;
    width: 100%;
  }

  .bottom-bar {
    height: 64px;
    border-top: 1px solid gray;

    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }


</style>