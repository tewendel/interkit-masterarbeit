<script>

  import marked from "marked"
  import { getShowDummyDataStore, dummyMarkdown } from './dummyDataHelpers.js'
  
  export let content

  const showDummyData = getShowDummyDataStore()
  if ($showDummyData) content = dummyMarkdown

</script>

<div class="MarkdownContent">
  {@html marked(content || '')}
</div>

<style>

  :global(.MarkdownContent) {
    text-align: var(--text-align);
  }

  :global(.MarkdownContent h1) {
    font: var(--font-content-headline-1);
    letter-spacing: var(--letter-spacing-content-headline-1);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  :global(.MarkdownContent h2) {
    font: var(--font-content-headline-2);
    letter-spacing: var(--letter-spacing-content-headline-2);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  :global(.MarkdownContent h3) {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  :global(.MarkdownContent h4) {
    font: var(--font-content-headline-4);
    letter-spacing: var(--letter-spacing-content-headline-4);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  :global(.MarkdownContent h5) {
    font: var(--font-content-headline-5);
    letter-spacing: var(--letter-spacing-content-headline-5);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }
  
  :global(.MarkdownContent p) {
    font: var(--font-body-1);
    letter-spacing: var(--letter-spacing-body-1);
  }

  :global(.MarkdownContent p:not(:last-child)) {
    margin-bottom: calc(var(--outset-y) * 0.75rem);
  }

  :global(.MarkdownContent li) {
    font: var(--font-body-1);
    letter-spacing: var(--letter-spacing-body-1);
    margin-bottom: calc(var(--outset-y) * 1rem);
  }

  :global(.MarkdownContent li li) {
    margin-bottom: 0;
  }

  :global(.MarkdownContent ul) { 
    list-style-type: disc; 
    list-style-position: inside; 
    margin-left: calc(var(--outset-x) * 0.5rem);
  }

  :global(.MarkdownContent ol) { 
    list-style-type: decimal; 
    list-style-position: inside; 
    margin-left: calc(var(--outset-x) * 0.5rem);
  }

  :global(.MarkdownContent ul ul, .MarkdownContent ol ul) { 
    list-style-type: circle; 
    list-style-position: inside; 
    margin-left: calc(var(--outset-x) * 1rem);
  }

  :global(.MarkdownContent ol ol, .MarkdownContent ul ol) { 
    list-style-type: lower-latin; 
    list-style-position: inside; 
    margin-left: calc(var(--outset-x) * 1rem);
  }

  :global(.MarkdownContent a) {
    text-decoration: underline;
    color: var(--color-text-link);
    word-break: break-all;
  }

</style>
