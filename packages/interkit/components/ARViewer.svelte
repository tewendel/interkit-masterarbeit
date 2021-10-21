<script>

  import { InterkitClient, util } from '../'
  import { onMount } from 'svelte';

  import MediaFileResolver from './MediaFileResolver.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import AspectRatio from './AspectRatio.svelte'
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

  const androidARmode = ARmode === "only" ? "ar_only" : "ar_preferred"

  const generateAndroidHref = url => 
  {
      const androidFallbackUrl = window ?
        encodeURIComponent(window.location.origin + window.location.pathname + "?android-ar-fallback")
        : "https://developers.google.com/ar"
      return `intent://` + 
      `arvr.google.com/scene-viewer/1.0`+ 
      `?file=${url}`+ 
      `&mode=${androidARmode}` + 
      `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;` + 
      `S.browser_fallback_url=${androidFallbackUrl};end;`
  }
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
        capability = "ios"
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
      <Button>
        <Icon type="close" on:click={() => executeTrigger(closeTrigger)} />
      </Button>
    </div>

    {#if mode === "video"}

      <!-- svelte-ignore a11y-media-has-caption -->
      <video autoplay muted loop>
        <MediaFileResolver let:url mediafileRef={element.videoFileRef} >
          <source src={url} >
        </MediaFileResolver>
      </video>
    
    {:else}

      <div class="box">

        <AspectRatio>
          <MediaFileImage 
            mediafileRef={element.imageFileRef} 
            fitDimension="both"
            objectFit="contain"
          />
        </AspectRatio>

        <div class="content">

          <h1 class="headline">
            Augmented Reality
          </h1>

            {#if capability === "android"}

              <div class="block">

                <div class="buttonContainer">
                  <MediaFileResolver let:url mediafileRef={element.glbFileRef} >
                    <a 
                      class="ARViewer__Link-android link-android"
                      bind:this={androidLinkRef} 
                      rel="external" 
                      title={element.title} 
                      href={generateAndroidHref(url)}
                    >
                      <Button flex="fill" size="large">
                        {startButtonText}
                      </Button>
                    </a>
                  </MediaFileResolver>
                </div>

                <div class="buttonInfo">
                  <slot name="androidInfo"></slot>
                </div>

              </div>

            {/if}

            {#if capability === "ios"}

              <div class="block">

                <div class="buttonContainer">
                  <Button flex="fill" size="large" on:click={() => iosLinkRef.click()}>
                    {startButtonText}
                  </Button>
                </div>

                <div class="buttonInfo">
                  <slot name="iosInfo"></slot>
                </div>

                <div style="position: absolute; z-index:-1; visibility: hidden">
                  <MediaFileResolver let:url mediafileRef={element.usdzFileRef} >
                    <a class="ARViewer__Link-ios link-ios" bind:this={iosLinkRef} rel="ar" title={element.title} href={url} >
                      <MediaFileResolver let:url={imgUrl} mediafileRef={element.imageFileRef} >
                        <img src={imgUrl} alt={element.title}/>
                      </MediaFileResolver>
                    </a>
                  </MediaFileResolver>
                </div>

              </div>

            {/if}

            <div class="block">

              <div class="buttonContainer">
                <Button flex="fill" type="secondary" size="large" on:click={() => mode = "video"}>
                  {videoButtonText}
                </Button>
              </div>

              <div class="buttonInfo">
                {#if capability === "video"}

                  <slot name="videoOnlyInfo"></slot>

                {:else}

                  <slot name="videoFallbackInfo"></slot>

                {/if}
              </div>
            </div>

        </div>

      </div>

    {/if} 

  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    flex:1;
    background-color: var(--color-background-highlight);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--distance-m);
    box-sizing: border-box;
    text-align: center;
  }

  .box {
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    border-width: var(--border-width);
    border-color: var(--border-color);
    border-style: solid;
    overflow: hidden;
    overflow-y: auto;
  }
  .content {
    padding: var(--distance-s);
  }

  .buttonContainer {
    padding: 0 var(--distance-xl);
    display: flex;
  }

  .headline, .block {
    padding: var(--distance-s);
  }

  .block:not(:first-child) {
    margin-top: var(--distance-s);
  }

  .headline {
    font: var(--font-headline-3);
  }

  .buttonInfo {
    padding-top: var(--distance-s);
    font: var(--font-body-2);
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
    top: var(--distance-m);
    right: var(--distance-m);
  }


</style>
