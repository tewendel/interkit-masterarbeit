<script>

  export let headline;

</script>

<div class="TopNavBarCustom">
  <nav class="TopNavBarCustom__Top">
    <slot name="left"/>
    {#if headline && headline != "undefined"}
      <span>
        {headline}
      </span>
    {/if}
    <div class="buttons-right">
      <slot name="right"/>
    </div>
  </nav>
  <div  class="TopNavBarCustom__Content content">
    <slot name="content"/>
  </div>
</div>

<style>
  .TopNavBarCustom {
    height: 100%;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
  }
  nav {
    display: flex;
    height: 55px;
    width: 100%;
    align-content: left;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid black;
  }
  .content {
    flex: 1;
    overflow: hidden;
  }
  .buttons-right {
    float: right;
  }


</style>