<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import MediaFileResolver from './MediaFileResolver.svelte'
  import MarkdownContent from './MarkdownContent.svelte'

  export let titleColumn; // title column
  export let glbColumn; // glb (android) column
  export let usdzColumn; // usdz (ios) column
  export let descriptionColumn; //  description column

  const ARElementStore = InterkitClient.getGlobalStore("ARElement")
  let element

  $: {
    element = {
      title: util.rowVal($ARElementStore, titleColumn),
      glbFileRef: util.rowVal($ARElementStore, glbColumn),
      usdzFileRef: util.rowVal($ARElementStore, usdzColumn),
    }
  }

</script>

<div class="ARViewer container">
  {#if element}
    <h2>contentKey</h2>
    <h2>{element.title}</h2>
    <ul>
      <li>
        GLB: {JSON.stringify(element.glbFileRef)}
        <MediaFileResolver let:url mediafileRef={element.glbFileRef} >
          <a rel="external" title={element.title} href={`intent://arvr.google.com/scene-viewer/1.0?file=${url}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`} >
            start android
          </a>
        </MediaFileResolver>
      </li>
      <li>
        USDZ: {JSON.stringify(element.usdzFileRef)}
        <MediaFileResolver let:url mediafileRef={element.usdzFileRef} >
          <a rel="ar external" title={element.title} href={url} >
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