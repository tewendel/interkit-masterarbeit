<script>
  import marked from "marked"
  
  export let content
</script>

<div class="MarkdownContent">
  {@html marked(content)}
</div>

<style>
  
  :global(.MarkdownContent p) {
    margin-bottom: 1em;    
  }

  :global(.MarkdownContent h2, .MarkdownContent h3, .MarkdownContent h4) {
    margin-top: 1em;
    margin-bottom: 1em;
  }

</style>