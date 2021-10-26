<script>

  import { onMount, getContext } from 'svelte'
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

  const elementProperties = InterkitClient.getGlobalStore("elementProperties");

  let elementsContext = getContext("elementsProvider");
  if(!elementsContext) alert("ProgressChecklist needs elementsContextProvider as parent");
  let elementsStore = elementsContext?.elements;

  const columnMap = {
    customIconColumn, 
    markerLabelColumn,
    orderColumn
  }

  let elements;
  elementsStore.subscribe((data)=>{
    elements = data.map(e => util.rowToObject(e.row, columnMap));
  })

  // we need to preassemble the marker html here because it requires async call to createIconDivHTML
  let markerHTMLs = {};
  const updateMarkerHTMLs = async () => {
    if(elements?.length)
      for(let element of elements) {
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
    elements;
    $elementProperties;
    updateMarkerHTMLs()
  }

</script>

<div class="container">

  {#if elements?.length } 

    <ul>
      {#each elements as element}
        <li>{@html markerHTMLs?.[element.key]}</li>
      {/each}
    </ul>

  {/if}

  <slot name="text"/>
  
</div>

<style>

  .container {
    padding: var(--distance-m);
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    align-items: center;
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
