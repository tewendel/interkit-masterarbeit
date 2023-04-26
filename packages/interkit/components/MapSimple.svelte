<script>

  import { onMount, setContext, getContext, onDestroy } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { fly } from 'svelte/transition';
  
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import MapRenderer from './MapRenderer.svelte'
  
  export let markerIconAsset; // default asset to use
  export let markerCheckedIconAsset; // checked asset
  export let markerPositionsColumn; // where the markers are
  export let secondaryPositionProperty; // an optional elementProperty that gives an element a user specific position
  export let customIconColumn; // a custom mediafile as icon for each element
  export let markerLabelColumn; // a short custom string for the marker (eg "01")
  export let markerTitleColumn; // a short custom string to appear above the marker, outside the bubble (eg "Foo Station")
  export let hideOnMapColumn; // option on elements to hide on map
  export let checkedProperty = "checked" // what property to use for the checkmark
  
  export let defaultLocation; // where to center the map [lat, lng]
  export let permissionNotification = "Die App hat keine Erlaubnis, ihre Position festzustellen. Unter Start > Einstellungen > FAQ finden Sie eine Anleitung, um die Erlaubnis für Ihr Gerät zu erteilen.";
  export let enableGeolocationHint = "Bitte aktivieren Sie ihren Standort."
  export let height; // height of the container
  export let showControls; // "TRUE" if we should show controls
  export let showPopups; // "TRUE" if we should show popup on marker tap
  export let mapId; // id of the map
  export let nearestElementMode = "FALSE"; // mode to show only the nearest element
  export let inline = "FALSE";
  export let disableControls = "FALSE";
  export let singleElementContext = "FALSE"; // mode to retrieve element from context and show just that
  export let style // mapboxGL style, probably a URL like https://api.maptiler.com/maps/1234uuid/style.json?key=f0o. If null-ish or "interkit", default stadiamaps (non-mapboxGL) will be used.
  export let apiKey 

  export let closeButtonLabel = "Schließen"
  
  export let clickTrigger;

  // for new iOS only at this moment
  const deviceorientationRequestPermission = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      console.log('DME reqPerm')
      DeviceMotionEvent.requestPermission()
        .then(permState => {
          console.log('DME reqPerm then', permState)
          if (permState === 'granted') {
            console.log('DMQ reqPerm granted')
            // the event listener will pick up deviceorientation events now
          }
        })
        .catch(e => {
          console.error('permReq error', e)
        })
    }
  }

  const columnMap = {
    customIconColumn,
    markerLabelColumn,
    markerTitleColumn,
    hideOnMapColumn,
    markerPositionsColumn
  }

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const mapFocus = InterkitClient.getGlobalStore("mapFocus")
  
  // check if secondaryPositionProperty should be used for mapFocus
  let mapFocusProcessed
  const processMapFocus = (value) => {
    let processed = value;
    if(value && value?.key && secondaryPositionProperty 
      && $elementProperties?.[value?.key]?.[secondaryPositionProperty]) {
        processed = $elementProperties?.[value?.key]?.[secondaryPositionProperty]
      }
    selectedElement = value  
    return processed;
  }
  $: mapFocusProcessed = processMapFocus($mapFocus)

  const userPositionStore = InterkitClient.getGlobalStore("userPosition");
  
  let markerObjects;
  let markerData; 
  let selectedElement;
  let nearestElement;
  let singleElement;

  let elements = getContext("elements");
  
  let unsubElements; // unsubscribe method to this store
  let markerObjs; // where we store the objects
  
  // retrieve row from qr scanner and convert to object with the columns specified in map
  let qrContext = getContext("qr-scanner")
  if(qrContext?.targetElementObj) {
    singleElement = util.rowToObject(qrContext.targetElementObj.row, columnMap)
    console.log("singleElement", singleElement)
  }

  if(!elements && !singleElement) console.log("MapSimple needs elements or QRScanner context to show markers");
  
  // set up subscription
  const initDataSubs = async () => {
    if(elements) {
      // convert elements to objects with the columns we need
      unsubElements = elements.subscribe((data)=>{
        markerObjs = data.map(e => util.rowToObject(e.row, columnMap));
        updateMarkerData();
      })
    }
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

    if(!markerObjs) {
      markerData = [];
      return
    }

    // start with the full set of data
    let selectedData = [...markerObjs];

    // if singleElement is set, use only that
    if(singleElement) {
      selectedData = [singleElement]
    }

    // find nearest element
    if($userPositionStore) {
      let markerObjs_sorted = [...selectedData].filter(r => r.markerPositionsColumn).sort(distanceSort)
      if(markerObjs_sorted.length) {
        nearestElement = markerObjs_sorted[0]
        // if nearestElementMode is set and we have a position, show only nearest element
        if(nearestElementMode == "TRUE") {
          selectedData = [nearestElement]
        }
      }
    }

    // prepare data for marker production
    markerData = selectedData.map(r=> {return {
      location: (secondaryPositionProperty && $elementProperties?.[r.key]?.[secondaryPositionProperty]) ?
                  $elementProperties?.[r.key]?.[secondaryPositionProperty] 
                :
                (
                  (r.markerPositionsColumn?.lat && r.markerPositionsColumn?.lng) ?
                  r.markerPositionsColumn : undefined
                ),
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
    deviceorientationRequestPermission()
  })

  onDestroy(()=>{
    if(unsubElements)
      unsubElements()
  })

  // set context for buttons in buttons slot
  const buttonPayloadStore = writable(null)
  setContext("buttonBar", {
    buttonPayload: buttonPayloadStore
  });

  // update store whenever it changes
  $: buttonPayloadStore.set(selectedElement ? selectedElement : nearestElement?.row)

  const containerClick = () => {
    deviceorientationRequestPermission()
    if(clickTrigger) {
      executeTrigger(clickTrigger)
    }
  }

  
</script>

  <div class="map-component-container" on:click={containerClick} class:inline="{inline == "TRUE"}">

    {#if selectedElement}
      <div class="marker_popup" 
        class:active={selectedElement ? true : false}
        in:fly="{{ y: 300, duration: 100, opacity: 1 }}"
      >
        <div class="marker_popup_close">
          <Button type="secondary" on:click={mapClick}>
            <Icon type="close" />
            <span>{closeButtonLabel}</span>
          </Button>
        </div>
        <div class="marker_popup_background">
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
      {style}
      {apiKey}
      mapFocus={mapFocusProcessed}
      {permissionNotification}
      {enableGeolocationHint}
    />

  </div>

<style>

  .map-component-container {
    height: 100%;
  }

  .map-component-container.inline {
    position: relative;
    border: 1px solid black;
    overflow: hidden;
    height: auto;
    display: flex;
    flex-direction: row;
    min-width: 40px;
    font-size: var(--font-size-regular);
  }

  /* need to be very cautious for iOS */
  .map-component-container.inline,
  .map-component-container.inline :global(.Map__Container),
  .map-component-container.inline :global(.map) {
    border-radius: var(--border-radius-button);
  }

  :global(.marker-content-label) {
    font-weight: bold;
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

  .marker_popup_close {
    position: absolute;
    top: calc(-40px - var(--distance-s));
    z-index: 10;
  }

  .marker_popup_background {
    background-color: #fff;
    position: relative;
    border-radius: var(--border-radius);
    border: 1px solid lightgray;
    overflow: hidden;
  }

  .marker_popup.active {
    display: block; 
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
