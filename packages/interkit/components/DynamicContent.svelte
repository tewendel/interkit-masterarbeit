<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import MarkdownContent from './MarkdownContent.svelte'

  export let keyColumn; // the column for the human readable keys 
  export let contentColumn; // the column for the content
  export let contentKey; // the key to select the row by
  export let format; // the format to use to display it

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

<div class="DynamicContent container" class:richtText={format == "richText"}>
  {#if $rowStore}
    {#if format == "richText"}
      {#if content}
        <MarkdownContent {content} />
      {/if}
    {:else}
      {content}
    {/if}
  {/if}
</div>

<style>
  .container {
    font-size: 14px;
    line-height: 20px;
    padding: 16px;
  }

</style>

<svelte:head>
  <style>
    .DynamicContent p {
      margin-bottom: 5px;
    }
  </style>
</svelte:head>