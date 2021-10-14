<div class="TopNavBarCustom">
  <nav class="TopNavBarCustom__Top">
    <div class="left TopNavBarCustom__Top__Left">
      <slot name="left"/>
    </div>
    <div class="right TopNavBarCustom__Top__Right">
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
    font-size: var(--font-size-headline-1);
  }
  nav {
    height: 55px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  :global(.TopNavBarCustom__Top__Left > *:not(:first-child)) {
    margin-left: 8px;
    display: inline-flex;
  }

  .right {
    text-align: right;
  }
  .content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  

</style>