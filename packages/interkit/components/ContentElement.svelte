<script>

  import marked from "marked"
  import { setContext, getContext } from 'svelte';
  import { get, writable } from 'svelte/store'
  import { onMount } from 'svelte';
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import Button from './Button.svelte'
  
  export let element; // alaways use prop if passed in directly 
  console.log("ContentElement with element prop", element)

  // otherwise use global store if available
  let elementDetail = InterkitClient.getGlobalStore("elementDetail")
  if(!element && $elementDetail) {
    element = $elementDetail
  }

  // otherwise get context from listNav
  let listNavContext = getContext("listNav")
  if(!element && listNavContext) {
    listNavContext.singleViewData.subscribe((data) => {
      element = data;
      console.log("detected listnav context update, set element to", element)
    })    
  }

  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(element)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(element)

  export let supertextColumn
  export let titleColumn
  export let shortDescriptionColumn
  export let descriptionColumn
  export let imageColumn
  export let locationColumn

  // get size from prop, or from element passed in, or default
  export let size = element?.size || "m"

  // xs - used in dashboard, no image, no description, no category info
  // s - used in bookmark list, small image, no description
  // m - used in map - small image, description
  // l - used in dashboard sliders and elementlist
  
  const elementColumns = {
    supertextColumn,
    titleColumn,
    descriptionColumn,
    shortDescriptionColumn,
    imageColumn,
    locationColumn
  }

  $: title = util.rowVal(element, elementColumns.titleColumn)
  $: supertext = util.rowVal(element, elementColumns.supertextColumn)
  $: description = util.rowValString(element, elementColumns.descriptionColumn)
  $: short_description = util.rowValString(element, elementColumns.shortDescriptionColumn)
  $: imageRef = util.rowVal(element, elementColumns.imageColumn)
  
  // we calculate our own distance here

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");
  let distanceMeters;
  let distance = "";

  const calculateDistance = (userPosition) => {
    let elementPosition = util.rowVal(element, elementColumns.locationColumn);
    distanceMeters = util.getDistance(elementPosition, userPosition)
    if(distanceMeters) {
      distance = util.formatDistance(distanceMeters)
    }
  }

  $: {
    calculateDistance($userPositionStore)
  }
  
  
</script>

{#if element}

  <section class={`ContentElementAudio container size-${size}`}>

    <figure class="ContentElementAudio__Picture picture">
      <MediaFileImage mediafileRef={imageRef} />    
    </figure>
      
    <div class="ContentElementAudio_Titles titles">

      <h4 class="ContentElementAudio__SubTitle subtitle">
        {#if supertext}
          <span>{supertext}</span>
        {/if}
      </h4>

      {#key title}
      <h3 class="ContentElementAudio__Title title">
        {title}
      </h3>
      {/key}

    </div>

    <div class="ContentElementAudio__Content content">
      
        {#if short_description}
          {@html marked(short_description)}
        {/if}

        {#if description}
          {@html marked(description)}
        {/if}
      
    </div>

    {#if distance}
      <div class="distance">
        distance: {distance}
      </div>
    {/if}

    <slot name="buttons">
    </slot>

  </section>

{/if}

<style>

  /* Layout */

  .container {
    display: grid;
    grid-template-rows: auto auto auto;
  }
  .picture {
    grid-column: 1;
    grid-row: 1 / span 2;
  }
  
  .controls {
    grid-column: 1;
    grid-row: 2;
  }

  .titles {
    grid-column: 1;
    grid-row: 3;
    display: flex;
    flex-direction: column;
  }

  .content {
    grid-column: 1;
    grid-row: 4;
    display: flex;
    flex-direction: column;
  }

  .titles .title {
    order: 2;
  }

  .titles .subtitle {
    order: 1;
  }

  .content .description {
    order: 1;
  }

  .content .link_container {
    order: 2;
  }

  /* Controls Layout */

  .controls {
    display: flex;
    padding: 8px;
  }

  .controls > *:not(:first-child) {
    margin-left: 8px;
  }
  .play {
    flex: 1;
  }

  .play {
    height: 2em;
    line-height: 2em;
  }

  .play span {
    vertical-align: middle;
  }

  /* elements */

  .titles {
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .subtitle {
    text-transform: uppercase;
    font-size: 10px;
  }

  .content {
    padding: 16px;
  }

  .description {
    margin-top: 8px;
  }

  .more_button {
    font-weight: bold;
    cursor: pointer;
  }

  .more_button:not(.show) {
    display: none;
  }

  .more_content {
    padding-top: 1em;
  }

  .more_content:not(.show) {
    display: none;
  }

  /* size variants */

  .container.size-s .description {
    display: none;
  }

  .container.size-s .picture {
    width: 25%; 
  }

  .container.size-m .controls {
    grid-row: 5;
  }

  .container.size-s .distance {
    display: none;
  }

  .container.size-xs .controls .bookmark, 
  .container.size-xs .picture, 
  .container.size-xs .titles .subtitle,
  .container.size-xs .content {
    display: none;
  }

  .ContentElementAudio__Bookmark_extra {
    display: none;
  }

  .container.size-xs {
    height: 66vh;
    display: flex;
    flex-direction: column;
    place-items: center;
    place-content: center;
    background-color: var(--color-background-highlight);
  }




</style>
