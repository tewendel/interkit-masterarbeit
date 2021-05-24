
<script>

  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Icon from './Icon.svelte'

  export let onTap;
  export let playing;
  export let loading = false;
  export let paused = false;
  
</script>

  {#if loading}
    <Loading/>
  {:else}
    <Button on:click={onTap}>
      {#if playing}
        <Icon height="1em" type={ paused ? "play" : "pause"} />
      {:else}
        <Icon height="1em" type="play" />
        &thinsp;
      {/if}
    </Button>
  {/if}
