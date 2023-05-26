<script>
  import { InterkitClient } from '../'

  export let variable;
  export let value;

  const projectDataStore = InterkitClient.userProjectDataStore;  
  $: currentValue = $projectDataStore?.userVars?.[variable]

</script>

{#if currentValue == value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}