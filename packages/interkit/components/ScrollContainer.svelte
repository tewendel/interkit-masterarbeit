<script>

  import { setContext } from 'svelte'

  let containerElement;

  const scrollUp = () => {
    //console.log("scroll up!")
    if(containerElement)
      containerElement.scrollTo(0, 0)
  }

  // context for children (for example ElementList)
  setContext("scrollContainer", {
    scrollUp 
  });


  

</script>


<div bind:this={containerElement}>
  <slot></slot>
</div>


<style>

  div {
    flex: 1;
    overflow-y: auto;
  }

</style>