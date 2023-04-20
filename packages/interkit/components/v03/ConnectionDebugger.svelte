<script>
  import { onMount } from 'svelte'
  import { InterkitClient } from '../'

  let connected = InterkitClient.connected;

</script>

{#if $connected}
  connected
{:else}
  not connected
{/if}

