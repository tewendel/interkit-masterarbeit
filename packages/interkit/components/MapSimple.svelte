<script context="module">

  import { InterkitClient, util } from '../'

  // assembles html to pass to leaflet for a custom marker div - also used in ProgressChecklist
  /* options:
          elementProperties,  
          checkedProperty,
          selectedElement,
          markerCheckedIconAsset,
          markerIconAsset
  */
  
  export const createIconDivHTML = async (element, options) => {

    let label = element?.markerLabelColumn;
    let labelSpan = label ? `<span>${label}</span>`: "";
    
    // get custom marker icon if available
    let mediafileRef = element?.customIconColumn;
    let mediafile;
    if(mediafileRef)
      mediafile = await InterkitClient.getMediaFile(mediafileRef.value); // this should probably be cashed locally on the client
    let iconSrc = mediafile?.link || options.markerIconAsset;

    // use checkmark if element is checked
    if(options.elementProperties?.[element.key]?.[options.checkedProperty]) {
      iconSrc = options.markerCheckedIconAsset;
    }

    // change style when marker is tapped
    let markerSelected = false;
    if(options.selectedElement && options.selectedElement?.key === element.key )
      markerSelected = true; 

    let html = `
    <div class="marker-container ${markerSelected ? 'selected' : ''}">
      ${labelSpan} <img src="${iconSrc}"/>
    </div>
    `;
    
    return html
  }


</script>


<script>

  import { onMount, setContext, onDestroy } from 'svelte'
  import { get } from 'svelte/store'
  import { fly } from 'svelte/transition';
  
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  import { Plugins, Capacitor } from '@capacitor/core';
  const { Geolocation, Permissions } = Plugins;

  export let permissionNotification = "Die App hat keine Erlaubnis, ihre Position festzustellen. Unter Start > Einstellungen > FAQ finden Sie eine Anleitung, um die Erlaubnis für Ihr Gerät zu erteilen.";

  export let markerIconAsset = "icons/Location.svg"; // default asset to use
  export let markerCheckedIconAsset = "icons/Check-Thin.svg"; // checked asset
  
  export let markerPositionsColumn; // where the markers are
  export let customIconColumn; // a custom mediafile as icon for each element
  export let markerLabelColumn; // a short custom string for the marker (eg "01")
  export let hideOnMapColumn; // option on elements to hide on map

  export let checkedProperty = "checked" // what property to use for the checkmark
  
  export let defaultLocation; // where to center the map [lat, lng]
  // what to tell the user when there is no permission for gps

  export let height; // height of the container
  export let showControls; // "TRUE" if we should show controls
  export let showPopups; // "TRUE" if we should show popup on marker tap
  export let mapId; // id of the map

  let defaultLocationLatLng = [51.505, -0.09];
  if(defaultLocation) {
    try {
      defaultLocationLatLng = JSON.parse(defaultLocation)
      //console.log("defaultLocationLatLng", defaultLocationLatLng)
    } catch(e) {
      console.log("error parsinng defaultLocation")
    }
  }
  
  let map;
  let mapElement; 
  
  let userIcon;
  let userPositionMarker;
  let markers = [];
  let geoWatch;
  let currentPosition;
  let hasHeading = false // heading direction

  let selectedElement;

  let elementRows; // store with the elements we want to show
  let unsubElementRows; // unsubscribe method to this store
  let markerRows;

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const mapFocus = InterkitClient.getGlobalStore("mapFocus")

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
      updateMarkers();
    })
  }
  

  const markerClick = async (e) => {
    console.log("marker clicked", e.target?.payload);
    
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

  const removeMarkers = () => {  
    for(let marker of markers) {
      map.removeLayer(marker)
    }
    markers = [];
  }

  // goes over data and recreates markers
  const updateMarkers = async () => {

    console.log("updateMarkers", markerRows)

    // filter rows
    let rowsFiltered = markerRows.filter(r => r.hideOnMapColumn != "true")

    // prepare data for marker production
    let markerValues = rowsFiltered.map(r=> {return {
      location: (r.markerPositionsColumn?.lat && r.markerPositionsColumn?.lng) ?
                r.markerPositionsColumn : undefined,
      element: r
    }})

    // clear old markers
    removeMarkers();

    // setup new markers
    for(let markerValue of markerValues) {
      if(markerValue.location) {
        
        let iconHTML = await createIconDivHTML(markerValue.element, {
          elementProperties: $elementProperties, 
          checkedProperty,
          selectedElement,
          markerCheckedIconAsset,
          markerIconAsset
        });
        let icon = L.divIcon({
          html: iconHTML,
          className: 'map-marker'
        });

        let marker = L.marker(markerValue.location, {icon}).addTo(map)
        
        marker.payload = {elementRow: markerValue.element.row}
        marker.on('click', markerClick);
        markers.push(marker);  
      }
    }
    // this probably needs to be much more efficient
  }

  // watch data changes to update markers
  $: {
    $elementProperties; // trigger function run 
    selectedElement; // trigger function run
    if(markerRows) {
      updateMarkers();
    }
  }

  onMount(async ()=>{
    
    await initDataSubs();

    /* basic map setup */

    map = L.map(mapId, {
      zoomControl: false,
      attributionControl: false,
    }).setView(defaultLocationLatLng, 14);  

    // default interkit map style
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on("click", mapClick);
    

    /* watch user position */

    let lastErrorCode;
    geoWatch = Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
      if(position) {
        currentPosition = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude, 
          heading: position.coords.heading,
          speed: position.coords.speed,
        }
        //console.log("currentPosition", JSON.stringify(currentPosition), err)

        let positionStore = InterkitClient.getGlobalStore("userPosition")
        positionStore.set(currentPosition);

        if(!userIcon)
          userIcon = L.divIcon({
            html: "<div class='user_pos_marker'><img class='user_pos' src='leaflet/user_pos.svg'></div>",
            iconUrl: "leaflet/user_pos.svg",
            iconSize:     [60, 60], 
            iconAnchor:   [30, 30], 
          });

        if(!userPositionMarker) {
          userPositionMarker = L.marker(currentPosition, {
            icon: userIcon
          }).addTo(map)
        } else {
          userPositionMarker.setLatLng(currentPosition); 
        }
      }
      
      if(err) {
        if(!lastErrorCode) {
          console.log(err)
          lastErrorCode = err.code;
        }
      }

    })
      
  })

  onDestroy(()=>{
    if(unsubElementRows)
      unsubElementRows()
    Geolocation.clearWatch(geoWatch)
  })

  const panToUserPosition = async () => {
    if(Capacitor.isNative) {
      let result = await Permissions.query({name: "geolocation"})
      console.log("geo permission", JSON.stringify(result))
      console.log("panning to", JSON.stringify(currentPosition))
      if(result.state != "granted") {
        alert(permissionNotification)
      } else {
        if(currentPosition) {
          map.panTo(currentPosition, {animate: false})
          map.setZoom(16)
        }
        else 
          console.log("currentPosition", currentPosition)
      }
    } else {
      if(currentPosition) {
        console.log(currentPosition)
        map.panTo(currentPosition, {animate: false})
        map.setZoom(16)
      }
    }
  }

  const zoomIn = async () => {
    map.zoomIn()
  }

  const zoomOut = async () => {
    map.zoomOut()
  }

  $: if($mapFocus) {
    console.log($mapFocus);
    let location = false
    selectedElement = null
    if ($mapFocus?.values?.position?.lat) {
      location = $mapFocus?.values?.position
      selectedElement = null;
    }
    else if ($mapFocus?.lat) location = $mapFocus
    if (location) {
      map.panTo({lat: location.lat, lng: location.lng}, {animate: false});
      map.setZoom(16);
    }
  }

  $: hasHeading = currentPosition && currentPosition?.heading !== false && currentPosition.heading !== null && currentPosition?.speed > 0

</script>

<div 
    class="Map__Container container" 
    class:hasHeading
    style={`--map-heading: ${currentPosition?.heading || 0}deg; height: ${height};`}
  >

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

  {#if showControls == "TRUE"}
    <div class="Map__Controls controls">

      <button class="Map__Controls__ZoomIn zoomIn">
        <Button on:click={zoomIn}>
          <Icon type="plus" />
        </Button>
      </button>

      <button class="Map__Controls__ZoomOut zoomOut">
        <Button on:click={zoomOut}>
          <Icon type="minus" />
        </Button>
      </button>

      <button class="Map__Controls__Locate locate" id="locateButton">
        <Button on:click={panToUserPosition}>
          <Icon type="position" />
        </Button>
      </button>

    </div>
  {/if}
  
  
  <div class="map" id={mapId} bind:this={mapElement}></div>

</div>

<style>

  .container {
    width: 100%;
    height: 100%;
    flex:1;
  }

  .map { 
    height: 100%;
    width: 100%;
  }

  #locateButton {
  }

  #locateButton:hover {
    cursor: pointer;
  }

  :global(div.marker-container) {
    background-color: #fff;
    border: 1px solid black;
    display: flex;
    flex-direction: row;
    padding: 5px;
    border-radius: 12px;
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

  :global(.leaflet-control) { /* hide default leaflet controls */
    display: none;
  }

  .controls {
    position: absolute;
    right: 0;
    bottom: calc(50% - 64px);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    padding: 8px;
  }

  .controls > * {
    margin: 8px;
  }
  .controls .locate {
    margin-top: 40px;
  }

  :global(.leaflet-div-icon) {
    background: transparent !important;
    border: none !important;
  }

  :global(.user_pos_marker) {
    width: 60px;
    height: 60px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  
  :global(.Map__Container:not(.hasHeading) .user_pos_marker) {
    background-image: none;
  }

  :global(.Map__Container.hasHeading .user_pos_marker) {
    background-image: url("../leaflet/user_pos_heading.svg");
    background-repeat: no-repeat;
    transform: rotate( var(--map-heading) );
  }

  :global(.user_pos) {
    width: 20px;
    height: 20px;
    animation: pulsate 5s;
    animation-iteration-count: infinite; 
  }

  @keyframes pulsate {
    0% {transform: scale(1);}
    20% {transform: scale(1.3);}
    40% {transform: scale(1);}
  }

  
</style>
