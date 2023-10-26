<script>

  export let slug

  function pageInIframe() {
   return (window.location !== window.parent.location);
  }

  const open = () => {
    if(pageInIframe()) {
      window.top.postMessage({method: "open-template", slug}, '*')
    } else {
      alert("Opening templates with these buttons currently only works when viewing the docs inside the authoring system.")
    }
    
  }

</script>

<div>
  <button on:click={open}>Open template '{slug}'</button>
</div>

<style>
  div {
    padding: 0.5em;
  }
</style>