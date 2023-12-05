<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import { Tag } from "carbon-components-svelte";

  let dateString
  
  onMount( async () => {
    const timestamp = await InterkitClient.call("system.getPlaygroundResetTimestamp")
    console.log("timestamp:.", timestamp)

    // get local date string from timestamp
    const date = new Date(timestamp * 1000)
    // format just the time hh:mm
    dateString = date.toLocaleDateString('de', { hour: 'numeric', minute: 'numeric' })
  })
</script>

{#if dateString}
  <Tag type="magenta">
    Playground resets<br>
    {dateString}
  </Tag>
{/if}