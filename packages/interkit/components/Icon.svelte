<script>
  export let type = ""
  export let height = "25px"
  export let inverse = false
</script>

<span class:inverse class={`icon icon-${type}`} style={`--height: ${height}`}>
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
    margin: 0 4px;
    cursor: pointer;
    user-select: none;
    display: inline-block;
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
</style>