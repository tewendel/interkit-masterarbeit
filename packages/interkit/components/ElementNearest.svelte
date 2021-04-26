<script>
  import { InterkitClient, util } from '../'
  import ElementSlider from './ElementSlider.svelte';

  export let title;
  export let elementRows;
  export let elementColumns;
  export let categoryColumns;

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");

  const distanceSort = (a, b) => {
    return util.getDistance(util.rowVal(a, elementColumns.locationColumn), $userPositionStore) - util.getDistance(util.rowVal(b, elementColumns.locationColumn), $userPositionStore)
  }
  $: elementRows_sorted = [...elementRows].sort(distanceSort)
  
</script>

<ElementSlider
  title={title}
  elementRows={[elementRows_sorted[0]]}
  {elementColumns}
  {categoryColumns}
/>
