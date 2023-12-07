<!-- src/routes/[slug]/+page.svelte -->
<script>

  import { Container} from 'interkit-websitetools'

  export let data;

</script>

<article>
  <Container padding="xs">
    <svelte:component this={data.content} />
  </Container>
</article>
