<script>
  import marked from "marked";

  export let source
</script>

<div class="markdown">
  {@html marked(source)}
</div>

<style lang="scss">
  @use '@carbon/type';

  .markdown {
    @include type.type-style('body-long-01');
  }

  .markdown :global( > *)
  {
    margin-top: 0;
    margin-bottom: 1em;
  }
  .markdown :global(h1){
    margin-bottom: 0.5em;
  }
  .markdown :global(blockquote) {
    border-left: 4px solid #dfe2e5;
    padding: 0 15px;
  }
  .markdown :global(pre) {
    background-color: white;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
  }
  .markdown :global(code) {
    font-family: monospace;
  }
  .markdown :global(ul) {
  }
  .markdown :global(ol) {
    padding-left: 1em;
  }
  .markdown :global(ul > li::before) {
    /* dash */
    content: "– ";
  }
  .markdown :global(ol > li) {
    list-style-type: decimal;
  }
</style>