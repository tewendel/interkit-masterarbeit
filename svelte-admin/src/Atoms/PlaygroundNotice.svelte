<script>
  import { InterkitClient } from 'interkit'
  import { Tag } from "carbon-components-svelte";
  import Timer from "carbon-icons-svelte/lib/Timer.svelte";
  
  export let large

  let timestamp, dateString, date
  
  const load = async () => {
    timestamp = await InterkitClient.call("system.getPlaygroundResetTimestamp")
    console.log("timestamp:.", timestamp)

    // get local date string from timestamp
    date = new Date(timestamp * 1000)
    // format just the time hh:mm
    dateString = date.toLocaleDateString('de', { hour: 'numeric', minute: 'numeric' })
  }

  const connected = InterkitClient.connected
  
  $: {
    if ($connected) {
      load()    
    }
  }
</script>

{#if timestamp && date && dateString}
  <slot />
  <Tag size={large ? "default" : "sm"} type="magenta" icon={Timer} style="white-space: nowrap;;">
    Playground resets<br>
    {dateString}
  </Tag>
{/if}