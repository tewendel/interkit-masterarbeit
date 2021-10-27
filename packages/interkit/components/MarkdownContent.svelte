<script>
  import marked from "marked"
  
  export let content
</script>

<div class="MarkdownContent">
  {@html marked(content)}
</div>

<style>

  :global(.MarkdownContent) {
    text-align: var(--text-align) ;
  }

  :global(.MarkdownContent h1) {
    font-family: var(--font-family-headline);
    font-size: var(--font-size-headline-1);
    margin-bottom: 16px;
    font-weight: normal;
    line-height: var(--font-size-headline-1);
  }
  
  :global(.MarkdownContent p:not(:last-of-type)) {
    margin-bottom: 1em;    
  }

  :global(.MarkdownContent h2 + p, .MarkdownContent h3 + p, .MarkdownContent h4 + p) {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  :global(.MarkdownContent li) {
    margin-bottom: 1em;
  }
  :global(.MarkdownContent ul) { 
    list-style-type: '- '; 
    list-style-position: inside; 
  }
  :global(.MarkdownContent ol) { 
    list-style-type: decimal; 
    list-style-position: inside; 
  }
  :global(.MarkdownContent ul ul, .MarkdownContent ol ul) { 
    list-style-type: circle; 
    list-style-position: inside; 
    margin-left: 15px; 
  }
  :global(.MarkdownContent ol ol, .MarkdownContent ul ol) { 
    list-style-type: lower-latin; 
    list-style-position: inside; 
    margin-left: 15px; 
  }

  :global(.MarkdownContent a) {
    word-break: break-all;
  }

</style>