<script>
  import { InterkitClient, util } from '../'
  import ContentElementAudio from './ContentElementAudio.svelte';


  export let title;
  export let elementRows = [];
  export let elementColumns;
  export let categoryColumns;

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");

  const distanceSort = (a, b) => {
    return util.getDistance(util.rowVal(a, elementColumns.locationColumn), $userPositionStore) - util.getDistance(util.rowVal(b, elementColumns.locationColumn), $userPositionStore)
  }
  $: elementRows_sorted = [...elementRows].sort(distanceSort)
  
</script>

<ContentElementAudio
    size="xs"
    element={elementRows_sorted[0]}
    {elementColumns}
    {categoryColumns}
  />
