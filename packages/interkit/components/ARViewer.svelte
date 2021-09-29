<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import MediaFileResolver from './MediaFileResolver.svelte'
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
  let origin = null

  // subscribe to the rows in that sheet
  let rowStore;
  onMount(async () => {
    rowStore = await InterkitClient.getRowSubStore(sheetKey)  
    console.log(rowStore)
  })

  let androidHref
  let iosHref

  $: {
    if ($rowStore) {
      row = $rowStore.find(r => util.rowVal(r, keyColumn) === contentKey);
      values = row ? row.values : {}
      console.log(values)
    }

    if (values && values.glbFile) {
      androidHref = `intent://arvr.google.com/scene-viewer/1.0?file=${values.glbFile}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`
    }

    if (values && values.usdzFile) {
      iosHref = values.usdzFile
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
        <MediaFileResolver let:url mediafileRef={values.glbFile} >
          <a rel="external" title={values.title} href={`intent://arvr.google.com/scene-viewer/1.0?file=${url}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`} >
            start android
          </a>
        </MediaFileResolver>
      </li>
      <li>
        USDZ: {JSON.stringify(values.usdzFile)}
        <MediaFileResolver let:url mediafileRef={values.usdzFile} >
          <a rel="ar external" title={values.title} href={url} >
            start iOS
          </a>
        </MediaFileResolver>
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