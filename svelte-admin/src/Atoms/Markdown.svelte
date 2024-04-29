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
    @include type.type-style('body-short-01');
  }
  .markdown :global( > *)
  {
    margin-top: 0;
    margin-bottom: 1em;
  }
  .markdown :global(h1),
  .markdown :global(h2),
  .markdown :global(h3),
  .markdown :global(h4),
  .markdown :global(h5),
  .markdown :global(h6) {
    margin-bottom: 0.5em;
  }
  .markdown :global(p) {
    font-size: inherit;
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
    //background-color: #f4f7f9;
    background-color: white;
    padding: 0.1em 0.25em;
    font-size: 0.9em;
    border-radius: 4px;
    position: relative;
    padding-bottom: 0.15em;
  }
  .markdown :global(ul) {
    list-style-type: "\2014";
  }
  .markdown :global(ol),
  .markdown :global(ul) {
    padding-left: 1em;
    margin-left: 0;
  }
  .markdown :global(li > ul),
  .markdown :global(li > ol) {
    margin-top:1em;
  }
  .markdown :global(ol > li) {
    list-style-type: decimal;
  }
  .markdown :global(ul > li) {
    padding-left: .5em;
  }
  .markdown :global(*:not(h1,h2,h3,h4,h5,h6) > h5) {
    margin-top: 1.5em;
  }

</style>