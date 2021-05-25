
<script>

  import Button from './Button.svelte'
  import Loading from './Loading.svelte'
  import Icon from './Icon.svelte'

  export let onTap;
  export let playing; // this is set when this is the audio element currently in the player
  export let loading = false;
  export let paused = false;
  
</script>

  {#if loading && playing}
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
