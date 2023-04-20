<script>
  export let url
</script>

<iframe
  height="450"
  width="800"
  src="https://www.figma.com/embed?embed_host=astra&url={url}"
  allowfullscreen
/>

<style>
  iframe {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #bbb;
    max-width: calc(100% - 20px);
  }
</style>