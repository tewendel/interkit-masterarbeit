<script>

  export let url // the embed url for the video, eg https://www.youtube.com/embed/L3auHTVXut4?si=w9uzhgGFRBP_qzV5

</script>

<div class="youtube-video-container">
  <iframe 
    width="560" 
    height="315" 
    src={url} 
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
  </iframe>
</div>


<style>
  .youtube-video-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
}

.youtube-video-container::after {
  display: block;
  content: "";
  padding-top: 56.25%;
}

.youtube-video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>