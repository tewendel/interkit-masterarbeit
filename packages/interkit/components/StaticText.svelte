<script>

  export let text = "lorem ipsum"
  export let tag = "span"

</script>

<svelte:element this={tag}>{text}</svelte:element>

<style>

  span, p, h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-headline);
    color: var(--color-text-headline);
  }

</style>
