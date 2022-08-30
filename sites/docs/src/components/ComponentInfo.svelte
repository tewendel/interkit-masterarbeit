<script>
  import { Highlight, HighlightAuto } from "svelte-highlight";
  import typescript from "svelte-highlight/languages/typescript";
  import github from "svelte-highlight/styles/github";

  export let code
  export let noheader = false
</script>

<svelte:head>
  {@html github}
</svelte:head>

{#if !noheader}
<h2>Source</h2>
{/if}
<Highlight language={typescript} {code} />

<style>
  pre {
    background-color: #f5f5f5;
  }
</style>