<script>
  import { InterkitClient } from '../'

  let userId = InterkitClient.userId;

  $:  console.log($userId)

</script>

{#if $userId}
  <slot name="iftrue">
  </slot>
{:else}
  <slot name="else">
  </slot>
{/if}