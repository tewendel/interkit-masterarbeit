<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import { Tag } from "carbon-components-svelte";

  let timestamp, dateString, date
  
  onMount( async () => {
    timestamp = await InterkitClient.call("system.getPlaygroundResetTimestamp")
    console.log("timestamp:.", timestamp)

    // get local date string from timestamp
    date = new Date(timestamp * 1000)
    // format just the time hh:mm
    dateString = date.toLocaleDateString('de', { hour: 'numeric', minute: 'numeric' })
  })
</script>

{#if timestamp && date && dateString}
  <Tag type="magenta">
    Playground resets<br>
    {dateString}
  </Tag>
{/if}