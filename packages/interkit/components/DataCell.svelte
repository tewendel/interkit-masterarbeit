<script>

  import { InterkitClient, util } from '..'
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';
  import MarkdownContent from './MarkdownContent.svelte'

  export let column; // the column for the content
  export let format; // the format to use to display it
  export let defaultContent; // what to use instead
  export let inline = false // add spacings or not
  export let centerContent = false // center content
  
  let element = getContext("element");
  console.log("DataCell got element store from context", $element)
  if(!element) {
    console.warn("DataCell needs an element context, for example from DataList")
  }

  let userProjectData = InterkitClient.userProjectDataStore  

  let content;

  const addSpecialElements = (c) => {
    let result = c?.replace("[config]", JSON.stringify(get(InterkitClient.config)))
    result = result?.replace("[version]", JSON.stringify(get(InterkitClient.config)?.bundle_version))
    result = result?.replace("[userToken]", $userProjectData?.userToken)
    return result
  }

  const updateContent = async (row) => {
    let original_content = util.rowVal(row, column)
    content = addSpecialElements(original_content);
  }

  $: {
    updateContent($element)
    $userProjectData // trigger this function
  }

</script>

<div
  class="DataCell DynamicContent container
    DataCell--format{format} {inline ? "DataCell--inline" : ""} DataCell--aligncontent{centerContent}
  "
  class:richText={format == "richText"}
  class:inline
  style={`--text-align: ${centerContent ? "center" : "left"}`}
  >
  {#if $element}
    {#if format == "richText"}
      {#if content}
        <MarkdownContent {content} />
      {:else if defaultContent}
        <MarkdownContent content={defaultContent} />
      {/if}
    {:else}
      {#if content}
        {content}
      {:else if defaultContent}
        {defaultContent}
      {/if}
    {/if}
  {/if}
</div>

<style>
  .container {
    font-size: inherit;
    line-height: 1.43;
    padding: var(--distance-s) var(--distance-m);
  }

  .inline {
    padding: 0;
  }

  .inline:not(.richText) {
    display: inline;
  }



</style>
