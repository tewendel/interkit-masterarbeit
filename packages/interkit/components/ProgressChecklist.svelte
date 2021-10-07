<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import Icon from './Icon.svelte'

  // import function that assembles html from map - not a svelte component because we need plain html in leaflet
  import { createIconDivHTML } from './MapSimple.svelte'

  export let customIconColumn;
  export let markerLabelColumn;

  export let markerIconAsset = "icons/Location.svg"; // default asset to use
  export let markerCheckedIconAsset = "icons/Check-Thin.svg"; // checked asset
  export let checkedProperty = "checked" // what property to use for the checkmark

  // retrieve the store with element objects
  let elements;
  onMount(async () => {
    elements = await InterkitClient.getRowSubStore(customIconColumn, { 
      customIconColumn, 
      markerLabelColumn
    }, "progressChecklist")
  })

  // the global store that contains element properties
  const elementProperties = InterkitClient.getGlobalStore("elementProperties");
  if(!$elementProperties) elementProperties.set({}); 

  // we need to preassemble the marker html here because it requires async call to createIconDivHTML
  let markerHTMLs = {};
  const updateMarkerHTMLs = async (elements, elementProperties) => {
    if(elements?.length)
      for(let element of elements) {
        markerHTMLs[element.key] = await createIconDivHTML(element, {
          elementProperties,
          checkedProperty,
          markerCheckedIconAsset,
          markerIconAsset
        })
      }
  }
  $: updateMarkerHTMLs($elements, $elementProperties)

</script>

<div class="container">

  {#if $elements?.length } 

    <ul>
      {#each $elements as element}
        <li>{@html markerHTMLs?.[element.key]}</li>
      {/each}
    </ul>

  {/if}

  <div class="info">
    <slot name="text"/>
  </div>

</div>

<style>

  .container {
    margin:  16px;
  }

  ul {
    display: flex;
  }

  li {
    margin: 10px; 
  }

  p {
    font-size: var(--font-size-regular);
    line-height: var(--line-height-regular);
  }

</style>