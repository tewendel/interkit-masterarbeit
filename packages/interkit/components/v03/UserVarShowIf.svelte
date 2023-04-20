<script>
  import { InterkitClient } from '../'

  export let variable;
  const projectDataStore = InterkitClient.userProjectDataStore;  
  $: value = $projectDataStore?.userVars?.[variable]

</script>

{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}