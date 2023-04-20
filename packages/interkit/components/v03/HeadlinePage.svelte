<script>

  export let headline = "test headline"
  export let subtitle

</script>

<h1 class="HeadlinePage">{headline}</h1>

{#if subtitle}
<h2>{subtitle}</h2>
{/if}

<style>

  h1 {
    font-family: var(--font-family-headline);
    color: var(--color-text-headline);
  }

</style>
