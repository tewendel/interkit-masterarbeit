
<nav class="TopNavBarCustom__Top">
  <div class="left TopNavBarCustom__Top__Left" >
    <slot name="left"/>
  </div>
  {#if $$slots.center}
    <div class="center TopNavBarCustom__Top__Center" >
      <slot name="center"/>
    </div>
  {/if}
  <div class="right TopNavBarCustom__Top__Right" >
    <slot name="right"/>
  </div>
</nav>


<style>

  nav {
    min-height: 55px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-between;
    box-sizing: border-box;
    padding-left: var(--distance-m);
    padding-right: var(--distance-m);
    padding-top: var(--distance-s);
    padding-bottom: var(--distance-s);
  }
  
  .TopNavBarCustom__Top__Left,
  .TopNavBarCustom__Top__Center,
  .TopNavBarCustom__Top__Right {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: clip;
  }

  .left {
    flex: 1;
  }

  :global(.TopNavBarCustom__Top__Left > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(.TopNavBarCustom__Top__Right > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(.TopNavBarCustom__Top__Left span, .TopNavBarCustom__Top__Center span, .TopNavBarCustom__Top__Right span) {
    font-size: var(--font-size-headline-1);
  }
  
  .center {
    flex: 1;
    text-align: center;
  }

  .center + .right {
    flex: 1;
  }

  .right {
    text-align: right;
  }



</style>
