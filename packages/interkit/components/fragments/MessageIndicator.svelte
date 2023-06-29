<script>

  import Label from "../Label.svelte"
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  

  export let counter;
  export let time;

  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    counter = 4
    time = "4:15"
  }

</script>

{#if counter || time}
<div class="container">
  {#if counter}<Label type="text" content={counter}/>{/if}
  {#if time}<span class="time">{time}</span>{/if}
</div>
{/if}

<style>

  .container {
    display: flex;
    align-items: center;
  }

  .time {
    font: var(--font-caption-bold);
  }


</style>