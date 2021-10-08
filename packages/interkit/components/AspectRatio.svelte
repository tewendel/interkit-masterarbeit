<script>
  // especially useful for images

  export let aspectRatioType = "element" // choose from predefined interkit types
  export let aspectRatio = null // manual setting
  export let standalone = false // add border

  const aspectRatioTypes = {
    small_overlay: .46,
    element: .55,
    large_overlay: .74,
    square: 1,
  }

  aspectRatio = aspectRatio || aspectRatioTypes[aspectRatioType]

  // method: see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6

</script>

<div class:standalone style={`--aspect-ratio: ${ aspectRatio * 100 }%`}>

</div>

<style>
  .aspect-ratio-box {
    background: white;
  }
  .aspect-ratio-box::before {
    content: "";
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0;
    padding-top: var(--aspect-ratio);
  }
  .aspect-ratio-box::after { /* to clear float */
    content: "";
    display: table;
    clear: both;
  }

  .standalone {
    border: 1px solid black;
    border-radius: 20px;
  }
</style>