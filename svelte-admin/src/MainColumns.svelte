<script>
  export let sidebarLeftLabel
  export let modalPanelRightLabel
</script>

<div class="MainColumns columns">
  <div class="sidebarLeft">
    <h2>{sidebarLeftLabel}</h2>
    <slot name="sidebarLeft" ></slot>
  </div>
  <div class="contentMain">
    <slot name="content" ></slot>
  </div>
  <div class="modalPanelRight">
    <h2>{modalPanelRightLabel}</h2>
    <slot name="modalPanelRight" ></slot>
  </div>
</div>

<style>

.columns {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.sidebarLeft {
  flex-grow: 1;
  background: lightgreen;
  border: 1em solid green;
  padding: 1em;
}

.contentMain {
  flex-grow: 1;
  background: lightyellow;
  border: 1em solid yellow;
  padding: 1em;
}

.modalPanelRight {
  flex-grow: 1;
  background: lightblue;
  border: 1em solid blue;
  padding: 1em;
}

</style>
