<script>

  const localDocsURL = "http://localhost:3010"
  const remoteDocsURL = "https://docs.interkit.app"
  const docsURL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? localDocsURL : remoteDocsURL;

</script>

<iframe title="interkit docs" src={docsURL}></iframe>

<style>

iframe {
  width: 100%;
  min-height: 800px;
}

</style>