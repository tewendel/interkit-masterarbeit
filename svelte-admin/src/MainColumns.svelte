<script>

  export let sidebarLeftLabel
  export let modalPanelRightLabel

  let modalPanelRightOpen = false

  export const modalPanelRightOpenSet = v => {
    modalPanelRightOpen = v
  }

  let sidebarLeftOpen = true

</script>

<div class="MainColumns columns">
  <div
    class={`sidebarLeft ${sidebarLeftOpen ? 'sidebarLeft--open' : 'sidebarLeft--closed'}`}
    >
    {#if !sidebarLeftOpen}
      <button
        class="sidebarLeftToggle"
        on:click={() => { sidebarLeftOpen = true }}>
        +
      </button>
    {:else}
      <div class="sidebarLeftHeader">
        <button on:click={() => { sidebarLeftOpen = false }}>minimize</button>
        <h2>{sidebarLeftLabel}</h2>
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
    <div
      class="modalPanelRight"
      >
      <button on:click={() => { modalPanelRightOpen = false }}>close</button>
      <h2>{modalPanelRightLabel}</h2>
      <slot name="modalPanelRight" ></slot>
    </div>
  {/if}
</div>

<style>

.button {
}

.columns {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  position: relative;
}

.sidebarLeft {
  flex-grow: 0;
  flex-basis: 20%;
  background: lightgreen;
  border: 1em solid green;
  padding: 1em;
  display: flex;
  flex-direction: column;
}

.sidebarLeft--closed {
  flex-basis: 2em;
}

.sidebarLeftHeader {
  height: 50px;
  flex-grow: 0;
  flex-shrink: 0;
}

.sidebarLeftSlot {
  flex-grow: 1;
  overflow: scroll;
}

.contentMain {
  flex-grow: 1;
  background: lightyellow;
  border: 1em solid yellow;
  padding: 1em;
}

.modalPanelRight {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: lightblue;
  border: 1em solid blue;
  padding: 1em;
}

</style>
