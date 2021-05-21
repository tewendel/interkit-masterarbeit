
<script>

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let onTap;
  export let playing;
  export let paused = false;
  
</script>

<Button on:click={onTap}>
  {#if playing}
    <Icon height="1em" type={ paused ? "play" : "pause"} />
  {:else}
    <Icon height="1em" type="play" />
    &thinsp;
  {/if}
</Button>
