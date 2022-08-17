<script>
  import MediaFileResolver from "./MediaFileResolver.svelte";
  export let mediafileKey // specify the mediafile key directly as a prop

</script>

<MediaFileResolver mediafileRef={{value: mediafileKey}} let:url>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls src={url} />
</MediaFileResolver>