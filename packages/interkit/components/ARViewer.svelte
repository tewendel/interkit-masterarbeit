<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import MediaFileResolver from './MediaFileResolver.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import { executeTrigger } from '../actions'

  // slots:
  // - iosInfo
  // - androidInfo
  // - videoFallbackInfo
  // - videoOnlyInfo

  export let titleColumn; // title column
  export let glbColumn; // glb (android) column
  export let usdzColumn; // usdz (ios) column
  export let modelPreviewImageColumn; // 3d preview image column
  export let videoColumn; // video column
  export let startButtonText;
  export let videoButtonText;
  export let closeTrigger; // triggered at close
  //export let helpButtonTrigger // further info
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

  let capability // video | ios | android
  let mode = "init" // init | video

  onMount(()=> {
    const a = document.createElement("a");
    if (a.relList.supports("ar")) {
      // iOS quickloor AR is available.
      capability = "ios"
    } else {
      const userAgent = window.navigator.userAgent
      if (/Android/i.test(userAgent)) {
        // android 
        capability = "android"
      } else {
        capability = "video"
      }
    } 

     // start automatically
    setTimeout(() => {
      // if (mode === "android") androidLinkRef.click()
      // if (mode === "ios") iosLinkRef.click()
      }, 1000
    )

    // close automatically
    setTimeout(() => {
      if (capability !== "video") {
          // executeTrigger(closeTrigger)
        }
      }, 2000
    )

  })

  $: {
    element = {
      title: util.rowVal($ARElementStore, titleColumn),
      glbFileRef: util.rowVal($ARElementStore, glbColumn),
      usdzFileRef: util.rowVal($ARElementStore, usdzColumn),
      imageFileRef: util.rowVal($ARElementStore, modelPreviewImageColumn),
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

    {#if mode === "video"}

      <!-- svelte-ignore a11y-media-has-caption -->
      <video autoplay muted loop>
        <MediaFileResolver let:url mediafileRef={element.videoFileRef} >
          <source src={url} >
        </MediaFileResolver>
      </video>

    {:else}

      {#if capability === "android"}

        <slot name="androidInfo"></slot>

        <MediaFileResolver let:url mediafileRef={element.glbFileRef} >
          <a 
            class="ARViewer__Link-android link-android"
            bind:this={androidLinkRef} 
            rel="external" 
            title={element.title} 
            href={generateAndroidHref(url)}
          >
            <Button inverse>
              {startButtonText}
            </Button>
          </a>
        </MediaFileResolver>
      {/if}

      {#if capability === "ios"}

        <slot name="iosInfo"></slot>

        <Button inverse on:click={() => iosLinkRef.click()}>
          {startButtonText}
        </Button>

        <div style="position: absolute; z-index:-1; visibility: hidden">
          <MediaFileResolver let:url mediafileRef={element.usdzFileRef} >
            <a class="ARViewer__Link-ios link-ios" bind:this={iosLinkRef} rel="ar" title={element.title} href={url} >
              <MediaFileResolver let:url={imgUrl} mediafileRef={element.imageFileRef} >
                <img src={imgUrl} alt={element.title}/>
              </MediaFileResolver>
            </a>
          </MediaFileResolver>
        </div>

      {/if}

      {#if capability === "video"}

        <slot name="videoOnlyInfo"></slot>

      {:else}

        <br />
        <slot name="videoFallbackInfo"></slot>

      {/if}

      <Button type="secondary" on:click={() => mode = "video"}>
        {videoButtonText}
      </Button>

    {/if}

  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  a img {
    height: 20vmin;
    width: 60vmin;
    object-fit: cover;
    border-radius: var(--border-radius);
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
