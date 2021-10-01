<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import MediaFileResolver from './MediaFileResolver.svelte'
  import MarkdownContent from './MarkdownContent.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import { executeTrigger } from '../actions'

  export let titleColumn; // title column
  export let glbColumn; // glb (android) column
  export let usdzColumn; // usdz (ios) column
  export let imageColumn; // image column
  export let videoColumn; // video column
  export let closeTrigger; // triggered at close
  export let ARmode = "only" // "preferred" | "only"

  const ARElementStore = InterkitClient.getGlobalStore("ARElement")
  let element

  let iosLinkRef
  let androidLinkRef

  const androidFallbackUrl = "https://developers.google.com/ar"
  const androidARmode = ARmode === "only" ? "ar_only" : "ar_preferred"

  const generateAndroidHref = url => 
    `intent://` + 
    `arvr.google.com/scene-viewer/1.0`+ 
    `?file=${url}`+ 
    `&mode=${androidARmode}` + 
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;` + 
    `S.browser_fallback_url=${androidFallbackUrl};end;`

  let mode // video | ios | android

  onMount(()=> {
    const a = document.createElement("a");
    if (a.relList.supports("ar")) {
      // iOS quickloor AR is available.
      mode = "ios"
    } else {
      const userAgent = window.navigator.userAgent
      if (/Android/i.test(userAgent)) {
        // android 
        mode = "android"
      } else {
        mode = "video"
      }
    } 

     // start automatically
    setTimeout(() => {
      if (mode === "android") androidLinkRef.click()
      if (mode === "ios") iosLinkRef.click()
      }, 1000
    )

    // close automatically
    setTimeout(() => {
      if (mode !== "video") {
          executeTrigger(closeTrigger)
        }
      }, 2000
    )

  })

  $: {
    element = {
      title: util.rowVal($ARElementStore, titleColumn),
      glbFileRef: util.rowVal($ARElementStore, glbColumn),
      usdzFileRef: util.rowVal($ARElementStore, usdzColumn),
      imageFileRef: util.rowVal($ARElementStore, imageColumn),
      videoFileRef: util.rowVal($ARElementStore, videoColumn),
    }
    console.log(element)
  }

</script>

<div class="ARViewer container">
  {#if element}
    <div class="ARViewer__Close close">
      <Icon type="close" on:click={() => executeTrigger(closeTrigger)} />
    </div>
    {#if mode == "video"}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video autoplay muted loop>
        <MediaFileResolver let:url mediafileRef={element.videoFileRef} >
          <source src={url} >
        </MediaFileResolver>
      </video>
    {:else}
      <ul>
        <li>
          AR VIEW
          mode={mode}
        </li>
        <li>
          <MediaFileResolver let:url mediafileRef={element.glbFileRef} >
            <a 
              bind:this={androidLinkRef} 
              rel="external" 
              title={element.title} 
              href={generateAndroidHref(url)}
            >
              <Button inverse>
                start android
              </Button>
            </a>
          </MediaFileResolver>
        </li>
        <li>
          <MediaFileResolver let:url mediafileRef={element.usdzFileRef} >
            <a bind:this={iosLinkRef} rel="ar" title={element.title} href={url} >
              <MediaFileResolver let:url={imgUrl} mediafileRef={element.imageFileRef} >
                <img style="display:inline" src={imgUrl} alt={element.title}/>
              </MediaFileResolver>
            </a>
          </MediaFileResolver>
        </li>
      </ul>
    {/if}
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.8);
  }

  a img {
    height: 40px;
  }

  video {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .close {
    position: absolute;
    z-index: 1;
    top: 1em;
    right: 1em;
  }


</style>