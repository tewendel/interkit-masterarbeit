<script>

  export let columns = "2"

</script>

<div class="container columns-{columns}">
  <div class="col1">
    <slot name="col1"/>
  </div>
  <div class="col2">
    <slot name="col2"/>
  </div>
  {#if columns == "3"}
    <div class="col3">
      <slot name="col3"/>
    </div>
  {/if}
</div>

<style>

  .container {
    display: flex;
    flex-direction: row;
  }

  .col1, .col2, .col3 {
    flex: 1;
    flex-shrink: 1;
    min-width: 0;
    overflow-x: hidden;
  }



</style>