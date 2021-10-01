<script>
  import marked from "marked"
  
  export let content
</script>

<div class="MarkdownContent">
  {@html marked(content)}
</div>

<style>

  :global(.MarkdownContent h1) {
    font-size: var(--font-size-headline-1);
    margin-bottom: 16px;
    font-weight: normal;
    line-height: var(--font-size-headline-1);
  }
  
  :global(.MarkdownContent p) {
    margin-bottom: 1em;    
  }

  :global(.MarkdownContent h2 + p, .MarkdownContent h3 + p, .MarkdownContent h4 + p) {
    margin-top: 1em;
    margin-bottom: 1em;
  }


</style>