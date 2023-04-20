<script>
  import { Highlight, HighlightAuto } from "svelte-highlight";
  import typescript from "svelte-highlight/languages/typescript";
  import github from "svelte-highlight/styles/github";

  export let component; // example: "BottomMenu"
  export let code = null // example: "<script> import ....;"
  export let noheader = false

</script>

<svelte:head>
  {@html github}
</svelte:head>

{#if !noheader}
<h2>Source</h2>
{/if}

{#if code}
<details>
  <summary>see source code</summary>
  <Highlight language={typescript} code={code} />
</details>
{:else}
  {#await import(`../../../../packages/interkit/components/${component}.svelte?raw`)}
    Loading component source...
  {:then Module}
    <Highlight language={typescript} code={Module.default} />
  {:catch error}
    error: {error}
  {/await}
{/if}

<style>
  details {
    margin-bottom: 1em;
  }
</style>