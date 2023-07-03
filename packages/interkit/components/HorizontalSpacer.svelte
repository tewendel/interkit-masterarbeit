<!-- TODO refactor/cleanup _TopNavBar classes -->
<nav class="HorizontalSpacer _TopNavBarCustom__Top">
  <div class="HorizontalSpacer__Left left _TopNavBarCustom__Top__Left" >
    <slot name="left"/>
  </div>
  {#if $$slots.center}
    <div class="HorizontalSpacer__Center center _TopNavBarCustom__Top__Center" >
      <slot name="center"/>
    </div>
  {/if}
  <div class="HorizontalSpacer__Right right _TopNavBarCustom__Top__Right" >
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
  
  ._TopNavBarCustom__Top__Left,
  ._TopNavBarCustom__Top__Center,
  ._TopNavBarCustom__Top__Right {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: clip;
  }

  .left {
    flex: 1;
    display: flex;
    align-items: center;
  }

  :global(._TopNavBarCustom__Top__Left > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(._TopNavBarCustom__Top__Right > *:not(:first-child)) {
    margin-left: 8px;
  }

  :global(._TopNavBarCustom__Top__Left span, ._TopNavBarCustom__Top__Center span, ._TopNavBarCustom__Top__Right span) {
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
