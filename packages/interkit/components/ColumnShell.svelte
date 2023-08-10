<script>

  export let columns = "2"

</script>

<div class="ColumnShell container columns-{columns} ColumnShell--columns{columns}">
  <div class="ColumnShell__Col1 col1">
    <slot name="col1"/>
  </div>
  <div class="ColumnShell__Col2 col2">
    <slot name="col2"/>
  </div>
  {#if columns == "3"}
    <div class="ColumnShell__Col3 col3">
      <slot name="col3"/>
    </div>
  {/if}
</div>

<style>

  .container {
    display: flex;
    flex-direction: row;
    gap: calc(var(--outset-x) * 0.5rem);
  }

  .col1, .col2, .col3 {
    flex: 1;
    flex-shrink: 1;
    min-width: 0;
  }



</style>
