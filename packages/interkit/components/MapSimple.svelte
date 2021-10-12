<script>

  import { onMount, setContext, onDestroy } from 'svelte'
  import { get } from 'svelte/store'
  import { fly } from 'svelte/transition';
  
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import MapRenderer from './MapRenderer.svelte'

  export let markerIconAsset; // default asset to use
  export let markerCheckedIconAsset; // checked asset
  export let markerPositionsColumn; // where the markers are
  export let customIconColumn; // a custom mediafile as icon for each element
  export let markerLabelColumn; // a short custom string for the marker (eg "01")
  export let hideOnMapColumn; // option on elements to hide on map
  export let checkedProperty = "checked" // what property to use for the checkmark
  export let defaultLocation; // where to center the map [lat, lng]
  export let permissionNotification = "Die App hat keine Erlaubnis, ihre Position festzustellen. Unter Start > Einstellungen > FAQ finden Sie eine Anleitung, um die Erlaubnis für Ihr Gerät zu erteilen.";
  export let height; // height of the container
  export let showControls; // "TRUE" if we should show controls
  export let showPopups; // "TRUE" if we should show popup on marker tap
  export let mapId; // id of the map

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const mapFocus = InterkitClient.getGlobalStore("mapFocus")
  
  let elementRows; // store with the elements we want to show
  let unsubElementRows; // unsubscribe method to this store
  
  let markerRows;
  let markerData; 
  let selectedElement;
  
  // set up subscription
  const initDataSubs = async () => {
    
    const columnMap = {
      customIconColumn,
      markerLabelColumn,
      hideOnMapColumn,
      markerPositionsColumn
    }
    
    elementRows = await InterkitClient.getRowSubStore(markerPositionsColumn, columnMap, "mapMarkers");
    unsubElementRows = elementRows.subscribe((rowsArray)=>{
      markerRows = rowsArray;
      updateMarkerData();
    })
  }

  $: {
    selectedElement;
    updateMarkerData();
  }
  
  // preprocess data for marker creation in map renderer
  const updateMarkerData = async () => {

    if(!markerRows) {
      markerData = [];
      return
    }

    // filter rows
    let rowsFiltered = markerRows.filter(r => r.hideOnMapColumn != "true")

    // prepare data for marker production
    markerData = rowsFiltered.map(r=> {return {
      location: (r.markerPositionsColumn?.lat && r.markerPositionsColumn?.lng) ?
                r.markerPositionsColumn : undefined,
      checked: $elementProperties?.[r.key]?.[checkedProperty] ? true : false, 
      selected: selectedElement?.key == r.key ? true : false,
      element: r
    }})
  }

  const markerClick = async (e) => {
    //console.log("marker clicked", e.target?.payload);
    
    if(showPopups == "TRUE") {
      selectedElement = {
        ...e.target?.payload?.elementRow,
        onPlay: () => {selectedElement = null}
      }
    }
  }

  const mapClick = () => {
    selectedElement = null;
  }

  onMount(async ()=>{
    await initDataSubs();      
  })

  onDestroy(()=>{
    if(unsubElementRows)
      unsubElementRows()
  })

</script>

  {#if selectedElement}
    <div class="marker_popup" 
      class:active={selectedElement ? true : false}
      transition:fly="{{ y: 300, duration: 100, opacity: 1 }}"
    >
      <div class="marker_popup_background">
        <div class="marker_popup_close">
          <Button class="marker_popup_close" on:click={mapClick}>
            <Icon type="close" />
          </Button>
        </div>
        {#if selectedElement}
          <slot name="element" element={{...selectedElement, size: "m"}}></slot>
        {/if}
      </div>
    </div>
  {/if}

  <MapRenderer
    {defaultLocation}
    {height}
    {showControls}
    {mapId}
    {markerData}
    {markerClick}
    {mapClick}
    elementProperties={$elementProperties}
    mapFocus={$mapFocus}
  />

<style>

  .marker_popup {
    position: absolute;
    bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 2000;
    display: none;
    width: 100%;
    box-sizing: border-box;

  }

  .marker_popup_background {
    background-color: #fff;
    position: relative;
    border-radius: 24px;
    border: 1px solid black;
  }

  .marker_popup.active {
    display: block; 
  }

  .marker_popup_close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
  
</style>
