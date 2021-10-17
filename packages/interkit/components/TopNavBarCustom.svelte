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
  }
  nav {
    min-height: 55px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: var(--border-width) solid var(--color-border);
    padding-left: var(--distance-m);
    padding-right: var(--distance-m);
    padding-top: var(--distance-s);
    padding-bottom: var(--distance-s);
  }


  /*
  .TopNavBarCustom__Top__Left,
  .TopNavBarCustom__Top__Right {
    white-space: nowrap;
    text-overflow: ellipsis;
    flex:1;
    overflow: hidden;
  }
  */

  :global(.TopNavBarCustom__Top__Left > *),
  :global(.TopNavBarCustom__Top__Right > *) {
    display: inline-flex;
  }

  :global(.TopNavBarCustom__Top__Left > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(.TopNavBarCustom__Top__Right > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(.TopNavBarCustom__Top__Left span, .TopNavBarCustom__Top__Right span) {
    font-size: var(--font-size-headline-1);
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
