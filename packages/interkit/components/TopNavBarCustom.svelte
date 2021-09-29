<div class="TopNavBarCustom">
  <nav>
    <slot name="left"/>
    <slot name="right"/>
  </nav>
  <div class="content">
    <slot name="content"/>
  </div>
</div>

<style>
  .TopNavBarCustom {
    height: 100%;
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
  }


</style>