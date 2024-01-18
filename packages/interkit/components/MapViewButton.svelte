<script>
  import { get } from "svelte/store";
  import { InterkitClient, util } from "../";
  import Icon from "./Icon.svelte"
  import FilterControls from "./fragments/FilterControls.svelte";
  import MapLayerOverlay from "./fragments/MapLayerOverlay.svelte";
  import { onMount } from "svelte";

  export let text;
  export let layerSelectPrompt;
  export let type = "filters" // filters | layers 
  
  export let mapId;
  export let typeColumn;
  export let orderColumn;
  
  export let titleColumn;
  export let imageColumn;
  export let descriptionColumn;
  export let labelColumn;
  export let subtitleColumn;

  export let tilesUrlColumn;
  export let mapBoxGLStyleColumn;
  export let markerCategoryColumn;

  // subscribe to mapViews
  let mapViewsStore;
  onMount(async () => {
    if (typeColumn) {
      const sheetKey = util.getSheetKey(typeColumn)
      mapViewsStore = sheetKey
        ? await InterkitClient.getRowSubStore(sheetKey, { 
          typeColumn, 
          orderColumn,
          titleColumn, 
          imageColumn,
          descriptionColumn,
          labelColumn,
          subtitleColumn,
          tilesUrlColumn, 
          mapBoxGLStyleColumn 
        })
        : null 
    }
  })
  $: filters = mapViewsStore ? $mapViewsStore
    .filter(v => v.typeColumn == "filter")
    .sort((a, b) => a.orderColumn - b.orderColumn) : []
  $: layers = mapViewsStore ? $mapViewsStore
    .filter(v => v.typeColumn == "layer" || v.typeColumn == "layer+filter")
    .sort((a, b) => a.orderColumn - b.orderColumn) : []
 
  // update the active views according to "activeFilters" oder "activeLayers"
  const updateActiveViews = (views, activeType) => {
    const mapViewState = InterkitClient.getGlobalStore("mapViewState-" + mapId)
    mapViewState.set({
      ...get(mapViewState),
      [activeType]: views,
      markerCategoryColumn      
    })
    console.log("updateActiveViews", get(mapViewState))
  }

  // manage state of this button
  let state = "enabled" // enabled | selected
  const thisButtonInstanceMarker = {} // unique object
  const openMapViewButton = InterkitClient.getGlobalStore("openMapViewButton")
  const toggle = () => {
    if(state == "enabled") {
      state = "selected"
      openMapViewButton.set(thisButtonInstanceMarker)
    } else {
      state = "enabled"
    }
  }
  $: if($openMapViewButton != thisButtonInstanceMarker) state = "enabled" // deselect button if another has been selected

  

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="root {state} MapViewButton MapViewButton--state{state}"  on:click={toggle}>
  <Icon type={type == "filters" ? "Thin-Filter" : "Thin-Layer"}/>
  {text ? text : ""}
  <Icon type={state == "enabled" ? "Thin-Dropdown" : "Thin-Dropdown-Up"}/>
</span>

{#if type == "filters" && state == "selected"}
  <FilterControls mainClass="MapViewButton" {filters} {updateActiveViews}/>
{/if}

{#if type == "layers" && state == "selected"}
  <MapLayerOverlay {layerSelectPrompt} mainClass="MapViewButton" {layers} {updateActiveViews}/>
{/if}

<style>

  .root {
    font: var(--font-button);
    letter-spacing: var(--letter-spacing-button);
    border: var(--border-width) solid var(--color-border);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    display: inline-flex;
    padding:
      calc(var(--inset-y) * 0.25rem)
      calc(var(--inset-x) * 0.5rem);
    gap: calc(var(--outset-x) * 0.25rem);
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
  }

  .root.selected {
    background-color: var(--color-background-backdrop);
  }

  .root:active {
    background-color: var(--color-background-button-pressed);
  }


</style>
