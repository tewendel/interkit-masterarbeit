<script>
  export let fullWidthContent = "FALSE"

</script>

<div class="title">
  <slot name="title"/>
</div>

<div class="content" class:fullWidth={fullWidthContent == "TRUE"}>
  <slot name="content"/>
</div>

<style>

  .title {
    margin: var(--distance-s);
  }

  .content {
    margin: var(--distance-s);
    margin-bottom: var(--distance-l);
  }

  .content.fullWidth {
    margin-left: 0px;
    margin-right: 0px;
  }

</style>