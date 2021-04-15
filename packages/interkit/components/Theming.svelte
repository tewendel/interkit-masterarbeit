<script>
  export let cssFile
</script>

<svelte:head>
  {#if INTERKIT_APP_LOAD_THEME}
    <link rel='stylesheet' href={cssFile}>
  {/if}
</svelte:head>
