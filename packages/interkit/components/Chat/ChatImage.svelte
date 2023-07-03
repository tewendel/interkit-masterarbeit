<script>
  import MediaFileImage from "../MediaFileImage.svelte";

  export let message={}

  let settings = {
    fitDimension: "height",
    objectFit: "cover",
    height: "var(--chat-image-height)",
  }

  if (message?.payload?.options?.objectFit === "contain") {
    settings.fitDimension = "width"
    settings.objectFit = "contain"
    settings.height = null
  }

</script>

<MediaFileImage
  mediafileRef={{
    type: 'mediafile',
    value: message?.payload?.mediafileKey
  }}
  fitDimension={settings.fitDimension}
  objectFit={settings.objectFit}
  mainClass="ChatImage"
  style={settings.height && `height: ${settings.height}`}
  doFallback={true}
  zoomable={message?.payload?.options?.zoom !== false && !message?.payload?.options?.url}
/>
