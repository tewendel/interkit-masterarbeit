
<script>

  import {
    Button,
    Pagination
  } from 'carbon-components-svelte'

  import FitToHeight from 'carbon-icons-svelte/lib/FitToHeight.svelte'
  import CharacterWholeNumber from 'carbon-icons-svelte/lib/CharacterWholeNumber.svelte'

  import { onMount } from 'svelte'

  export let page
  export let pageSize
  export let totalItems
  export let pageSizes = [5, 10, 20, 30, 40, 50, 75, 100, 150, 200]
  export let rowHeight = 24
  export let overheadHeight = 0 +
    48 + // header of outer UI
    32 + // DataTable search, Toolbar size "sm"
    24 + // DataTable thead = default dense row height
    40 + // DataTable tfoot = Pagination
    24   // potential horizontal scrollbar + buffer

  export let pageSizeAuto = true

  /* must be in pageSizes */
  const defaultNonAutoPagesize = pageSizes[2] || pageSizes[0] || 20

  const fitTableRows = () => {
    if (!pageSizeAuto) return
    const fitRows = Math.floor((window.innerHeight - overheadHeight) / rowHeight)
    pageSize = Math.max(1, fitRows)
  }

  onMount(() => {
    fitTableRows()
    window.addEventListener('resize', () => {
      fitTableRows()
    })
  })

</script>

<div style="display: flex; background-color: #f4f4f4">
  <Button
    kind="ghost"
    size="field"
    icon={pageSizeAuto ? FitToHeight : CharacterWholeNumber}
    on:click={() => {
      pageSizeAuto = !pageSizeAuto
      if (!pageSizeAuto) pageSize = defaultNonAutoPagesize
      fitTableRows()
    }}
    iconDescription="toggle between automatic/manual row count"
    tooltipAlignment="start"
    tooltipPosition="top"
    style="border-top: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0"
    />
  <div style="padding-right: 1px; flex-grow: 1">
    <Pagination
      bind:pageSize
      bind:page
      {totalItems}
      {pageSizes}
      pageSizeInputDisabled={pageSizeAuto}
      />
  </div>
</div>
