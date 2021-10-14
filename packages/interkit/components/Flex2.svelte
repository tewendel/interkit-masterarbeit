<script>
  export let direction = "column" // row | column
  export let size1 = "fill"
  export let size2 = "min"
  export let style = ""
</script>

<div 
  class="Flex2 container"
  data-direction={direction}
  {style}
  >
  <div 
    class="first" 
    data-size={size1}
    >
    <slot name="first"></slot>
  </div>
  <div 
    class="slot"
    data-size={size2}
    >
    <slot name="second"></slot>
  </div>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
  }

  [data-direction=column] {
    flex-direction: column;
  }

  [data-size=fill] {
    flex: 1;
  }
</style>