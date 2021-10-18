<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import Icon from './Icon.svelte'

  // import function that assembles html from map - not a svelte component because we need plain html in leaflet
  import { createIconDivHTML } from './MapRenderer.svelte'

  export let customIconColumn;
  export let markerLabelColumn;
  export let orderColumn;

  export let markerIconAsset = "icons/Location.svg"; // default asset to use
  export let markerCheckedIconAsset = "icons/Check-Thin.svg"; // checked asset
  export let checkedProperty = "checked" // what property to use for the checkmark

  // retrieve the store with element objects
  let elements;
  let elementsSorted;
  onMount(async () => {
    elements = await InterkitClient.getRowSubStore(customIconColumn, { 
      customIconColumn, 
      markerLabelColumn,
      orderColumn
    }, "progressChecklist")
    elements.subscribe((data)=>{
      elementsSorted = data.sort((a, b) => a.orderColumn - b.orderColumn)
    })
  })

  // the global store that contains element properties
  const elementProperties = InterkitClient.getGlobalStore("elementProperties");
  if(!$elementProperties) elementProperties.set({}); 

  // we need to preassemble the marker html here because it requires async call to createIconDivHTML
  let markerHTMLs = {};
  const updateMarkerHTMLs = async () => {
    if($elements?.length)
      for(let element of $elements) {
        let checked = $elementProperties?.[element.key]?.[checkedProperty] ? true : false;
        markerHTMLs[element.key] = await createIconDivHTML(element, {
          checked,
          selected: checked, 
          markerCheckedIconAsset,
          markerIconAsset,
          noPointer: true
        })
      }
  }
  $: {
    $elements;
    $elementProperties;
    updateMarkerHTMLs()
  }

</script>

<div class="container">

  {#if elementsSorted?.length } 

    <ul>
      {#each elementsSorted as element}
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
    padding: var(--distance-m);
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info {
    background-color: white;
    border: var(--border-width) solid var(--color-border);
    border-radius:  var(--border-radius);
  }

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 80%;
  }

  li {
    
  }

  p {
    font-size: var(--font-size-regular);
    line-height: var(--line-height-regular);
  }

</style>
