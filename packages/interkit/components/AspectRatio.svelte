<script>
  // especially useful for images

  export let aspectRatioType = "element" // choose from predefined interkit types
  export let aspectRatio = null // manual setting
  export let standalone = false // add border

  if (typeof standalone == "string") standalone = standalone === "TRUE" // blockly conversion

  const aspectRatioTypes = {
    small_overlay: .46,
    element: .55,
    large_overlay: .74,
    square: 1,
  }

  aspectRatio = aspectRatio || aspectRatioTypes[aspectRatioType]

  // method: see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6

</script>

<div class:standalone class="AspectRatio container" style={`--aspect-ratio: ${ aspectRatio * 100 }%`}>
  <div class="inner-container">
    <slot />
  </div>
</div>

<style>
  .container {
    height: 0;
    overflow: hidden;
    padding-top: var(--aspect-ratio);
    background: white;
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .inner-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .standalone {
    border: 1px solid black;
    border-radius: 20px;
    overflow: hidden;
  }
</style>