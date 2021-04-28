<script>
  export let type = ""
  export let height = "25px"
</script>

<span class={`icon icon-${type}`} style={`--height: ${height}`}>
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

  .icon-arrow-up {
    background-image: url("../icons/Arrow-Up.svg");
  }

  .icon-arrow-down {
    background-image: url("../icons/Arrow-Down.svg");
  }

  .icon-close {
    background-image: url("../icons/Close.svg");
  }

  .icon-play {
    background-image: url("../icons/Play.svg");
  }

</style>