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
    font: var(--font-content-headline-1);
    letter-spacing: var(--letter-spacing-content-headline-1);
    margin-bottom: var(--distance-m);
  }

  :global(.MarkdownContent h2) {
    font: var(--font-content-headline-2);
    letter-spacing: var(--letter-spacing-content-headline-2);
    margin-bottom: var(--distance-m);
  }

  :global(.MarkdownContent h3) {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
    margin-bottom: var(--distance-m);
  }

  :global(.MarkdownContent h4) {
    font: var(--font-content-headline-4);
    letter-spacing: var(--letter-spacing-content-headline-4);
    margin-bottom: var(--distance-m);
  }

  :global(.MarkdownContent h5) {
    font: var(--font-content-headline-5);
    letter-spacing: var(--letter-spacing-content-headline-5);
    margin-bottom: var(--distance-m);
  }
  
  :global(.MarkdownContent p:not(:last-child)) {
    font: var(--font-body-1);
    letter-spacing: var(--letter-spacing-body-1);
    line-height: 24px;
    margin-bottom: 12px;    
  }

  :global(.MarkdownContent li) {
    margin-bottom: 1em;
  }
  :global(.MarkdownContent ul) { 
    list-style-type: disc; 
    list-style-position: inside; 
    margin-left: var(--distance-s);
  }
  :global(.MarkdownContent ol) { 
    list-style-type: decimal; 
    list-style-position: inside; 
    margin-left: var(--distance-s);
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
    text-decoration: none;
    color: var(--color-text-link);
    word-break: break-all;
  }

</style>