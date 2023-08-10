<!-- TODO refactor/cleanup _TopNavBar classes -->
<div class="root HorizontalSpacer _TopNavBarCustom__Top">
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
</div>


<style>

  .root {
    min-height: 3.5rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-between;
    box-sizing: border-box;
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem)
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem);
  }
  
  ._TopNavBarCustom__Top__Left,
  ._TopNavBarCustom__Top__Center,
  ._TopNavBarCustom__Top__Right {
    /* TODO: this used to be white-space:nowrap+ellipsis.
     * This breaks a lot of child (and grand-child) components because they inherit white-space.
     * You'll have to wrap the contents in a Component that does that.
     */
    display: flex;
  }

  .left {
    flex: 1;
    display: flex;
    align-items: center;
  }

  :global(._TopNavBarCustom__Top__Left > *:not(:first-child)) {
    margin-left: calc(var(--outset-x) * 0.5rem);
  }

  :global(._TopNavBarCustom__Top__Right > *:not(:first-child)) {
    margin-left: calc(var(--outset-x) * 0.5rem);
  }
  
  .center {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .center + .right {
    flex: 1;
  }

  .right {
    text-align: right;
    justify-content: flex-end;
  }



</style>
