<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import MarkdownContent from './MarkdownContent.svelte'

  export let keyColumn; // the column for the human readable keys 
  export let contentColumn; // the column for the content
  export let contentKey; // the key to select the row by
  export let format; // the format to use to display it
  export let defaultContent; // what to use instead
  export let inline = "FALSE" // add spacings or not

  // we first identify the sheet that contains our data
  let contentSheetKey = util.getSheetKey(contentColumn)
  //console.log(contentSheetKey)
  let contentRow;
  let content;

  // subscribe to the rows in that sheet
  let rowStore;
  onMount(async () => {
    rowStore = await InterkitClient.getRowSubStore(contentSheetKey)  
  })

  const addSpecialElements = (c) => {
    let result = c?.replace("[config]", JSON.stringify(get(InterkitClient.config)))
    result = result?.replace("[version]", JSON.stringify(get(InterkitClient.config)?.bundle_version))
    return result
  }

  const updateContent = async (contentSheetKey, contentKey, rows) => {
    if(rows) {
      contentRow = rows.find(r => util.rowVal(r, keyColumn) == contentKey);
      let original_content = util.rowVal(contentRow, contentColumn)
      content = addSpecialElements(original_content);
    }    
  }

  $: {
    updateContent(contentSheetKey, contentKey, $rowStore)
  }

</script>



{#if $$slots.default}
  <slot content={content || defaultContent}></slot>
{:else}
  <div class="DynamicContent container" class:richText={format == "richText"} class:inline={inline == "TRUE"}>
    {#if $rowStore}
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
          { defaultContent}
        {/if}
      {/if}
    {/if}
  </div>
{/if}

<style>
  .container {
    font-size: inherit;
    line-height: 1.43;
    padding: var(--distance-m);
  }

  .inline {
    padding: 0;
  }

  .inline:not(.richText) {
    display: inline;
  }

</style>
