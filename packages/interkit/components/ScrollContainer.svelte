<script>

  import { setContext, getContext } from 'svelte'

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

  // get context from BottomMenuPage
  let pageContext = getContext("BottomMenuPage");
  let lastScrollTop = 0;
  let lastScrolledUp;
  const scroll = (e) => {
    //console.log("scrolled to", e.target.scrollTop)
    if(pageContext?.setScrolling) {
      // scrolling down
      if(e.target.scrollTop > lastScrollTop 
        && (!lastScrolledUp || (new Date().getTime() - lastScrolledUp > 1000))
      ) {
        pageContext.setScrolling(1)
      }
      // scrolling up
      if(e.target.scrollTop < lastScrollTop) {
        pageContext.setScrolling(-1)
        lastScrolledUp = new Date().getTime()
        //console.log(lastScrolledUp)
      }
      
      lastScrollTop = e.target.scrollTop
    }
  }

  
</script>


<div bind:this={containerElement} on:scroll={scroll} class="ScrollContainer">
  <slot></slot>
</div>


<style>

  div {
    flex: 1;
    overflow-y: auto;
  }

</style>