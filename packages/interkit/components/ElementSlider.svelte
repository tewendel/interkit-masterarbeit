<script>

  import { onMount, getContext, onDestroy } from 'svelte'

  import { InterkitClient, util } from '../'

  import Slider from './Slider.svelte';

  export let dataSheetKey 
  export let sortColumn
  export let unlockedProperty = "unlocked"

  let dataSheet
  let dataSub
  let dataRows
  let dataRowsSorted

  const elementProperties = InterkitClient.getGlobalStore("elementProperties");
  if(!$elementProperties) elementProperties.set({}); 

  const setupSub = async () => {
    let dataRows = await InterkitClient.getRowSubStore(dataSheetKey)
    dataSub = dataRows.subscribe(data => {
      if (unlockedProperty) {
        data = data.filter(r => {
          // TODO test this. where does elementProperties come from??
          return $elementProperties?.[r.key]?.[unlockedProperty]
        })
      }
      if (sortColumn) {
        data.sort((a, b) => util.rowVal(a, sortColumn) - util.rowVal(b, sortColumn))
      }
      dataRowsSorted = data
    })
  } 

  onMount(async () => {
    dataSheet = await InterkitClient.getSheet(dataSheetKey)
    await setupSub()
  })

  onDestroy(async () => {
    if (dataSub) {
      dataSub()
    }
  })

</script>

<div class="container">
  {#if dataRowsSorted}
    {#if dataRowsSorted.length === 0}
      <div class="empty"><slot name="emptyElement"></slot></div>
    {:else}
      <Slider slides={dataRowsSorted} let:slide={row}>
        <slot name="contentElement" element={row} />
      </Slider>
    {/if}
  {/if}
</div>

<style>

  .empty {
    margin-left: var(--distance-s);
  }
</style>