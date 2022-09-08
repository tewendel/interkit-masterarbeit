<script>
  import MediaFileResolver from "./MediaFileResolver.svelte";
  export let mediafileKey // specify the mediafile key directly as a prop

  export let autoplay = undefined;;

</script>

<MediaFileResolver mediafileRef={{value: mediafileKey}} let:url>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video {autoplay} controls src={url} />
</MediaFileResolver>


<style>
  video {
      width: 100%;
      max-height: 100%;
      object-fit: cover;
  }

</style>