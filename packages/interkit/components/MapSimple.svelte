<script>

  import { onMount, setContext, getContext, onDestroy } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { fly } from 'svelte/transition';
  
  import { InterkitClient, util } from '../'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import MapRenderer from './MapRenderer.svelte'
  import ButtonBar from './ButtonBar.svelte'

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
  export let nearestElementMode = "FALSE"; // mode to show only the nearest element
  export let inline = "FALSE";
  export let disableControls = "FALSE";
  export let singleElementContext = "FALSE"; // mode to retrieve element from context and show just that

  const columnMap = {
    customIconColumn,
    markerLabelColumn,
    hideOnMapColumn,
    markerPositionsColumn
  }

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const mapFocus = InterkitClient.getGlobalStore("mapFocus") // not using this at the moment
  const userPositionStore = InterkitClient.getGlobalStore("userPosition");
  
  let elementRows; // store with the elements we want to show
  let unsubElementRows; // unsubscribe method to this store
  
  let markerRows;
  let markerData; 
  let selectedElement;
  let nearestElement;

  let singleElement;
  
  // retrieve row from qr scanner and convert to object with the columns specified in map
  let qrContext = getContext("qr-scanner")
  if(qrContext?.targetElementObj) {
    singleElement = util.rowToObject(qrContext.targetElementObj.row, columnMap)
    console.log("singleElement", singleElement)
  }
  
  // set up subscription
  const initDataSubs = async () => {
    
    elementRows = await InterkitClient.getRowSubStore(markerPositionsColumn, columnMap, "mapMarkers");
    unsubElementRows = elementRows.subscribe((rowsArray)=>{
      markerRows = rowsArray;
      updateMarkerData();
    })
  }

  const distanceSort = (a, b) => {
    return util.getDistance(a.markerPositionsColumn, $userPositionStore) - util.getDistance(b.markerPositionsColumn, $userPositionStore)
  }
  
  $: {
    selectedElement;
    $userPositionStore;
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

    // if singleElement is set, use only that
    if(singleElement) {
      rowsFiltered = [singleElement]
    }

    if($userPositionStore) {
      let markerRows_sorted = [...rowsFiltered].filter(r => r.markerPositionsColumn).sort(distanceSort)
      if(markerRows_sorted.length) {
        nearestElement = markerRows_sorted[0]
        // if nearestElementMode is set and we have a position, show only nearest element
        if(nearestElementMode == "TRUE") {
          rowsFiltered = [nearestElement]
        }
      }
    }

    // prepare data for marker production
    markerData = rowsFiltered.map(r=> {return {
      location: (r.markerPositionsColumn?.lat && r.markerPositionsColumn?.lng) ?
                r.markerPositionsColumn : undefined,
      checked: $elementProperties?.[r.key]?.[checkedProperty] ? true : false, 
      selected: selectedElement?.key == r.key ? true : false,
      element: r
    }})

    //console.log("updateMarkerData", markerData, mapId, $elementProperties)
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

  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(null)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(selectedElement ? selectedElement : nearestElement?.row)

  
</script>

  <div class="map-component-container" class:inline="{inline == "TRUE"}">

    {#if selectedElement}
      <div class="marker_popup" 
        class:active={selectedElement ? true : false}
        in:fly="{{ y: 300, duration: 100, opacity: 1 }}"
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
      {nearestElementMode}
      {nearestElement}
      {singleElement}
      {disableControls}
    />

    <div class="Map__Button__Bar button-bar-container">
      <ButtonBar>
        <slot name="button-bar" element={nearestElement}></slot>
      </ButtonBar>
    </div>

  </div>

<style>

  .map-component-container {
    height: 100%;
  }

  .map-component-container.inline {
    position: relative;
    border-radius: 25px;
    border: 1px solid black;
    overflow: hidden;
    height: auto;
    display: flex;
    flex-direction: row;
    border-radius: var(--border-radius-button);
    min-width: 40px;
    font-size: var(--font-size-regular);
  }

  :global(div.marker-container.selected) {
    background-color: lightgrey;
  }

  :global(div.marker-container.selected img) {
    filter: grayscale(1);
  }

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
    border-radius: var(--border-radius);
    border: 1px solid black;
  }

  .marker_popup.active {
    display: block; 
  }

  .marker_popup_close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
  }

  .button-bar-container {
    position: absolute;
    z-index: 1000;
    bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  :global(.Map__Button__Bar .Button) {
    margin-right: 8px;
  }
  
</style>
