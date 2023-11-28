<script>

  import { Button } from 'carbon-components-svelte'
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte'
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte'
  import Close from 'carbon-icons-svelte/lib/Close.svelte'

  export let rootClass

  export let sidebarLeftLabel
  export let modalPanelRightLabel

  let modalPanelRightOpen = false

  export const modalPanelRightOpenSet = v => {
    modalPanelRightOpen = v
  }

  let sidebarLeftOpen = true

</script>

<div class={`MainColumns columns ${rootClass}`}>
  <div
    class={`sidebarLeft ${sidebarLeftOpen ? 'sidebarLeft--open' : 'sidebarLeft--closed'}`}
    >
    {#if !sidebarLeftOpen}
      <Button
        kind="ghost"
        on:click={() => { sidebarLeftOpen = true }}
        iconDescription="maximize"
        tooltipAlignment="start"
        icon={Maximize}
        />
    {:else}
      <div>
        <div class="headingWithButton">
          <slot name="sidebarLeftTitleSlot"></slot>
          {#if sidebarLeftLabel}<h2>{sidebarLeftLabel}</h2>{/if}
          <Button
            kind="ghost"
            iconDescription="minimize"
            on:click={() => { sidebarLeftOpen = false }}
            icon={Minimize}
            />
        </div>
      </div>
      <div class="sidebarLeftSlot">
        <slot name="sidebarLeft" ></slot>
      </div>
    {/if}
  </div>
  <div class="contentMain">
    <slot name="contentMain"></slot>
  </div>
  {#if modalPanelRightOpen}
    <div class="modalPanelRight">
      <div class="modalPanelRightHeader">
        <div class="headingWithButton">
          <h2 style="font-size: 150%">{modalPanelRightLabel}</h2>
          <Button
            kind="ghost"
            iconDescription="close"
            on:click={() => { modalPanelRightOpen = false }}
            icon={Close}
            tooltipAlignment="end"
            />
        </div>
        <slot name="modalPanelRightHeaderActions" ></slot>
      </div>
      <div class="modalPanelRightSlot">
        <slot name="modalPanelRight" ></slot>
      </div>
    </div>
  {/if}
</div>

<style>

h1,
h2,
h3 {
  margin: 0;
  padding: 0;
}

.columns {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  position: relative;
}

.headingWithButton {
  display: flex;
  align-items: center;
}

.headingWithButton h1,
.headingWithButton h2,
.headingWithButton h3 {
  padding-left: 1rem;
  font-size: 100%;
  flex: 1 0;
}

.headingWithButton :global(button) {
  flex: 0 0;
}

.sidebarLeft {
  flex: 0 0 25%;
  width: 25%;
  max-width: 25%;
  min-width: 8em;
  background: white;
  display: flex;
  flex-direction: column;
  transition: max-width 300ms, min-width 300ms, width 300ms, flex-basis 300ms;
}

.sidebarLeft--closed {
  flex-basis: var(--sidebarCollapsedWidth);
  width: var(--sidebarCollapsedWidth);
  max-width: var(--sidebarCollapsedWidth);
  min-width: var(--sidebarCollapsedWidth);
}

/* force tooltip to fit in narrow sidebar */
.sidebarLeft--closed :global(.bx--assistive-text) {
  box-sizing: border-box;
  max-width: 100%;
  padding-left: 2px;
  padding-right: 2px;
}

.sidebarLeftHeader {
  flex-grow: 0;
  flex-shrink: 0;
}

.sidebarLeftSlot {
  flex-grow: 1;
  overflow: auto;
}

.contentMain {
  flex-grow: 1;
  background: #eee;
}

.modalPanelRight {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: white;
  display: flex;
  flex-direction: column;
}

.modalPanelRightHeader {
  border-bottom: 1px solid #ccc;
  flex-grow: 0;
  flex-shrink: 0;
}

.modalPanelRightSlot {
  flex-grow: 1;
  overflow: auto;
}

</style>
