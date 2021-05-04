<script>
  export let cssFile
  import { InterkitClient, util } from '../'

  let config = InterkitClient.config;

</script>

<svelte:head>
  {#if $config?.INTERKIT_APP_LOAD_THEME}
    <link rel='stylesheet' href={cssFile}>
  {/if}
</svelte:head>
