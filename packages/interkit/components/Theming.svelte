<script>
  export let cssFile
  export let jsFile
  import { InterkitClient, util } from '../'

  let config = InterkitClient.config;

</script>

<svelte:head>
  {#if $config?.INTERKIT_APP_LOAD_THEME}
    <link rel='stylesheet' href={cssFile}>
    <script src={jsFile}></script>
  {/if}
</svelte:head>
