<script>
  export let type
  export let height = "25px"
  export let inverse = false

  if (typeof inverse == "string") inverse = inverse === "TRUE" // blockly conversion

  console.log("BUTTON", type, height, inverse)
</script>

<span on:click class:inverse class={`icon icon-${type}`} style={`--height: ${height}`}>
  <slot />
</span>

<style>
  .icon {
    background-repeat: no-repeat;
    background-size: var(--height);
    background-position: center;
    color: transparent;
    border: none;
    width: var(--height);
    height: var(--height);
    cursor: pointer;
    user-select: none;
    display: inline-flex;
  }

  .icon.inverse {
    filter: invert(1);
  }

  .icon-arrow-up {
    background-image: url("../icons/Arrow-Up.svg");
  }

  .icon-arrow-down {
    background-image: url("../icons/Arrow-Down.svg");
  }

  .icon-arrow-left {
    background-image: url("../icons/Arrow-Left.svg");
  }

  .icon-arrow-right {
    background-image: url("../icons/Arrow-Right.svg");
  }

  .icon-close {
    background-image: url("../icons/Close.svg");
  }

  .icon-play {
    background-image: url("../icons/Play.svg");
  }

  .icon-pause {
    background-image: url("../icons/Pause.svg");
  }

  .icon-settings {
    background-image: url("../icons/Settings.svg");
  }

  .icon-plus {
    background-image: url("../icons/Plus.svg");
  }
  .icon-minus {
    background-image: url("../icons/Minus.svg");
  }

  .icon-position {
    background-image: url("../icons/Position.svg");
  }

  .icon-layer {
    background-image: url("../icons/Layer.svg");
  }

  .icon-filter {
    background-image: url("../icons/Filter.svg");
  }

  .icon-skip-forward {
    background-image: url("../icons/forward_10.svg");
  }

  .icon-skip-backward {
    background-image: url("../icons/replay_30.svg");
  }
</style>