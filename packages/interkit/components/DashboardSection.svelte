<script>
  export let fullWidthContent = "FALSE"
  export let cssClass;
</script>

{#if $$slots.title}
  <div class="title">
    <slot name="title"/>
  </div>
{/if}

<div class="Dashboard__Section content {cssClass}" class:fullWidth={fullWidthContent == "TRUE"}>
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