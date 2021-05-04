<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import marked from "marked"

  let projectId = INTERKIT_PROJECT_ID;

  export let keyColumn; // the column for the human readable keys 
  export let contentColumn; // the column for the content
  export let contentKey; // the key to select the row by
  export let format; // the format to use to display it

  // we first identify the sheet that contains our data
  let contentSheetKey = util.getSheetKey(contentColumn)
  //console.log(contentSheetKey)
  let contentRow;
  let content;

  onMount(async () => {
    let rows = await InterkitClient.call("rows.get", {sheetKey: contentSheetKey, projectId})
    contentRow = rows.find(r => util.rowVal(r, keyColumn) == contentKey);
    content = util.rowVal(contentRow, contentColumn);  
    
  });

</script>

<div class="DynamicContent container">
  {#if format == "richText"}
    {#if content}
      {@html marked(content)}
    {/if}
  {:else}
    {content}
  {/if}
</div>

<style>
  .container {
    font-size: 14px;
    line-height: 20px;
    padding: 16px;
  }
</style>
