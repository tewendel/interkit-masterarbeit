<script>
  // see https://css-tricks.com/aspect-ratio-boxes/#article-header-id-6
  export let aspect_ratio = 1
</script>

<div style={`--aspect-ratio: ${ aspect_ratio * 100 }%`}>

</div>

<style>
  .aspect-ratio-box {
    background: white;
  }
  .aspect-ratio-box::before {
    content: "";
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0;
    padding-top: var(--aspect-ratio);
  }
  .aspect-ratio-box::after { /* to clear float */
    content: "";
    display: table;
    clear: both;
  }
</style>