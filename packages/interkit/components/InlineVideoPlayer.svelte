<script>
  import MediaFileResolver from "./MediaFileResolver.svelte";
  import { getShowDummyDataStore, dummyVideoSrc } from './dummyDataHelpers.js'

  export let mediafileKey // specify the mediafile key directly as a prop

  export let autoplay = undefined;;

  const showDummyData = getShowDummyDataStore()

</script>

{#if $showDummyData}
  <video playsinline {autoplay} controls src={dummyVideoSrc} loop />
{:else}
  <MediaFileResolver mediafileRef={{value: mediafileKey}} let:url>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video playsinline {autoplay} controls src={$showDummyData ? dummyVideoSrc : url} />
  </MediaFileResolver>
{/if}

<style>
  ._workaround_ {}

  video {
      width: 100%;
      height: 100%;
      max-height: 100%;
      object-fit: cover;
  }

</style>
