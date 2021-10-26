<script>

  import { setContext, getContext } from 'svelte';
  import { get, writable } from 'svelte/store'
  import { onMount } from 'svelte';
  import { InterkitClient, util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import ButtonBar from './ButtonBar.svelte'
  import MarkdownContent from './MarkdownContent.svelte'
  
  export let element; // alaways use prop if passed in directly 
  //console.log("ContentElement with element prop", element)

  // otherwise use global store if available
  let elementDetail = InterkitClient.getGlobalStore("elementDetail")
  if(!element && $elementDetail) {
    element = $elementDetail
    console.log("using elementDetail store", element)
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

  // s - used in dashboard slider and lists (TODO)
  // m - used in map - small image, short description only
  // l - used in full view
  // slide - used in Slider
  // TODO: reorganize/generalize these styling options somehow?

  
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
  let distance;

  const calculateDistance = (userPosition) => {
    let elementPosition = util.rowVal(element, elementColumns.locationColumn);
    distanceMeters = util.getDistance(elementPosition, userPosition)
    if(distanceMeters) {
      distance = util.formatDistance(distanceMeters)
    }
  }

  /*
  $: {
    calculateDistance($userPositionStore)
  }
  */
  
  
</script>

{#if element}

  <section class={`ContentElementAudio container size-${size}`}>

    <figure class="ContentElementAudio__Picture picture">
      <AspectRatio>
        <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
      </AspectRatio>
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
      
        <div class="short-description">
          {#if short_description}
            <MarkdownContent content={short_description}/>
          {/if}
        </div>
        
        <div class="description">
          {#if description}
            <MarkdownContent content={description}/>
          {/if}
        </div>
      
    </div>


    <ButtonBar>    
      <slot name="buttons">
      </slot>{#if distance}<span class="distance">
        <Button type="secondary">
          <Icon type="location"/>
          {distance}
        </Button>
      </span>
      {/if}
    </ButtonBar>
    
    

  </section>

{/if}

<style>

  /* Layout */

  .container {
    display: grid;
    grid-template-rows: auto auto auto;
    padding: 8px;
    font-size: var(--font-size-regular);
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
    padding-top: 8px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .subtitle {
    text-transform: uppercase;
    font-size: 10px;
  }

  .content {
    padding: 8px;
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

  .container.size-l .button-bar-container {
    grid-row: 3;
  }  

  .container.size-l .titles {
    grid-row: 4;
  }

  .container.size-l .content {
    grid-row: 5;
  }

  .container.size-s {
    flex:1;
    height: 100%;
    width: 100%;
  }

  .container.size-s .short-description, .container.size-l .short-description {
    display: none;
  }

  .container.size-s .description, .container.size-m .description {
    display: none;
  }

  .container.size-s .titles {
    width: 50%;
  }

  .container.size-s-fill .titles {
    z-index: 1;
  }

  .container.size-s .picture {
    width: 25%; 
  }

  .container.size-s-fill .picture {
    grid-row: 1 / span 3;
    margin: -8px;
    
  }

  .container.size-s-fill .picture:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right:0;
    bottom:0;
    background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 33%, rgba(0,0,0,0) 100%);
  }

  .container.size-m .controls {
    grid-row: 5;
  }

  .container.size-s .distance, 
  .container.size-s .content {
    display: none;
  }

  .container.size-s-fill .distance, 
  .container.size-s-fill .content {
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

  .container.size-slide {
    padding: 0;
  }

  .container.size-slide .picture {
    grid-row: 1 / 4;
  }

  .container.size-slide .titles,
  .container.size-slide .content {
    display: none;
  }

  .container.size-slide .button-bar-container {
    grid-column: 1;
    grid-row: 3;
    padding: var(--distance-s);
  }

</style>
