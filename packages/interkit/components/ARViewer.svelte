<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';
  import MarkdownContent from './MarkdownContent.svelte'

  export let keyColumn; // key column, a unique identifier
  export let titleColumn; // title column
  export let glbColumn; // glb (android) column
  export let usdzColumn; // usdz (ios) column
  export let descriptionColumn; //  description column
  export let contentKey // the key to find the row to show

  // we first identify the sheet that contains our data
  let sheetKey = util.getSheetKey(keyColumn)
  console.log(sheetKey)
  let row = null
  let values = null

  // subscribe to the rows in that sheet
  let rowStore;
  onMount(async () => {
    rowStore = await InterkitClient.getRowSubStore(sheetKey)  
    console.log(rowStore)
  })

/*
  const addSpecialElements = (c) => {
    let result = c?.replace("[config]", JSON.stringify(get(InterkitClient.config)))
    result = result?.replace("[version]", JSON.stringify(get(InterkitClient.config)?.bundle_version))
    return result
  }
*/

  $: {
    if ($rowStore) {
      row = $rowStore.find(r => util.rowVal(r, keyColumn) === contentKey);
      values = row.values || null
      console.log(values)
    }
  }

</script>

<div class="ARViewer container">
  {#if values}
    <h2>contentKey</h2>
    {contentKey}
    <h2>{values.title}</h2>
    <ul>
      <li>
        GLB: {JSON.stringify(values.glbFile)}
      </li>
      <li>
        USDZ: {JSON.stringify(values.usdzFile)}
      </li>
    </ul>
  {/if}
</div>

<style>
  .container {
    font-size: 14px;
    line-height: 20px;
    padding: 16px;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.8);
  }

</style>