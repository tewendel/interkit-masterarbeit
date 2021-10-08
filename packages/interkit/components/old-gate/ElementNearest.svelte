<script>
  import { InterkitClient, util } from '../'
  import ContentElementAudio from './ContentElementAudio.svelte';
  import SectionHeadline from './SectionHeadline.svelte'

  export let title;
  export let elementRows = [];
  export let elementColumns;
  export let categoryColumns;

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");

  const distanceSort = (a, b) => {
    return util.getDistance(util.rowVal(a, elementColumns.locationColumn), $userPositionStore) - util.getDistance(util.rowVal(b, elementColumns.locationColumn), $userPositionStore)
  }
  let elementRows_sorted;
  $: {
    if($userPositionStore) {
      elementRows_sorted = [...elementRows].filter(r => util.rowVal(r, elementColumns.locationColumn)).sort(distanceSort)
    }
  }
  
</script>

{#if elementRows_sorted?.[0]}
  {#if title}
  <h3>
    <SectionHeadline>
      {title}
    </SectionHeadline>
  </h3>
  {/if}
  <ContentElementAudio
      size="xs"
      element={elementRows_sorted?.[0]}
      {elementColumns}
      {categoryColumns}
    />
{/if}