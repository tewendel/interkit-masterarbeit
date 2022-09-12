<!-- src/routes/[slug]/+page.svelte -->
<script>
  export let data;
</script>

<article>
  <svelte:component this={data.content} />
</article>