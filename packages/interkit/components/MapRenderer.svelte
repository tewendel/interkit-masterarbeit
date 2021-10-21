<script context="module">

  import { InterkitClient, util } from '../'
  
  // assembles html to pass to leaflet for a custom marker div - also used in ProgressChecklist
  /* options:
          checked,
          selected,
          markerCheckedIconAsset,
          markerIconAsset
          noPointer // show the little pointer
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
    if(options.checked) {
      iconSrc = options.markerCheckedIconAsset;
    }

    // change style when marker is tapped
    let markerSelected = false;
    if(options.selected)
      markerSelected = true; 

    let html = `
    <div class="marker-container ${options.noPointer ? 'no-pointer' : ''}">
      <div class="marker-content ${markerSelected ? 'selected' : ''}">${labelSpan} <img src="${iconSrc}"/></div>
    </div>
    `;
    
    return html
  }

</script>

<script>

  import { onMount, getContext, setContext, onDestroy } from 'svelte'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // leak mapligreGL (the FOSS implementation of L.mapboxGL) into the window scope...
  import 'maplibre-gl/dist/maplibre-gl.js';
  import 'maplibre-gl/dist/maplibre-gl.css';
  // ...so this can pick it up and provide the L.maplibreGL binding
  import '@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js';
  
  import { Plugins, Capacitor } from '@capacitor/core';
  const { Geolocation, Permissions } = Plugins;

  // what to tell the user when there is no permission for gps
  export let permissionNotification;
  export let height; // height of the container
  export let showControls; // "TRUE" if we should show controls
  export let mapId; // id of the map

  export let markerData; // the markers to show
  export let mapFocus; // the marker to center the map on
  export let markerClick;
  export let mapClick;

  export let markerIconAsset = "icons/Location.svg"; // default asset to use
  export let markerCheckedIconAsset = "icons/Check-Thin.svg"; // checked asset

  export let defaultLocation; // where to center the map by default [lat, lng]
  
  export let nearestElementMode = "FALSE";
  export let nearestElement;
  export let disableControls = "FALSE"

  export let style = 'interkit';

  // mode to show a single Element and center the map on that (used in qr scanner)
  export let singleElement;

  let defaultLocationLatLng = [51.505, -0.09];
  if(defaultLocation) {
    try {
      defaultLocationLatLng = JSON.parse(defaultLocation)
      //console.log("defaultLocationLatLng", defaultLocationLatLng)
    } catch(e) {
      console.log("error parsinng defaultLocation")
    }
  }

  let qrContext = getContext("qr-scanner");
  
  let map;
  let mapElement; 
  
  let positionStore = InterkitClient.getGlobalStore("userPosition")        
  let userIcon;
  let userPositionMarker;
  let geoWatch;
  let currentPosition;
  let hasHeading = false // heading direction

  let markers = [];
  let selectedMarker;

  let manualPosition = false;

  $: {
    markerData;
    updateMarkers();
  }

  const removeMarkers = () => {  
    for(let marker of markers) {
      map.removeLayer(marker)
    }
    markers = [];
  }

  // goes over data and recreates markers
  const updateMarkers = async () => {

    // clear old markers
    removeMarkers();

    if(!markerData) return;

    // setup new markers
    for(let markerValue of markerData) {

      //console.log("markerValue", markerValue)

      if(markerValue.location) {
        
        let iconHTML = await createIconDivHTML(markerValue.element, {
          checked: markerValue.checked,
          selected: markerValue.selected,
          markerCheckedIconAsset,
          markerIconAsset
        });
        let icon = L.divIcon({
          html: iconHTML,
          className: 'map-marker',
          iconAnchor: [24.5, 42]
        });

        //console.log("adding marker to map", markerValue, icon)

        let marker = L.marker(markerValue.location, {icon}).addTo(map)
        
        marker.payload = {elementRow: markerValue.element.row}
        marker.on('click', markerClick);
        markers.push(marker);  
      }
    }
    // this probably needs to be much more efficient
  }

  onMount(async ()=>{

    /* basic map setup */

    map = L.map(mapId, {
      zoomControl: false,
      maxZoom: 20,
      attributionControl: false,
    }).setView(singleElement ? singleElement.markerPositionsColumn : defaultLocationLatLng, 
     singleElement ? 17 : 14);  

    if(singleElement) {
      console.log("qrContext", qrContext)
      map.panBy(qrContext?.mapOffset, {animate: false});
    }

    if(disableControls == "TRUE") {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    }

    if (!style || style === 'interkit') {
      // default interkit map style
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);
    } else {
      L.maplibreGL({
        // attribution: 'TODO',
        style: style,
      }).addTo(map);
    }

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

    /* autoposition map if user doesnt interact */
    map.on('zoomstart', function() {
      manualPosition = true;  
    })
    map.on('dragstart', function() {
      manualPosition = true;
    })
      
  })

  const autoPositionMap = () => {
    if(manualPosition) return;
    if(singleElement) return;
    
    let group = new L.featureGroup([L.marker($positionStore), L.marker(nearestElement.markerPositionsColumn)]);
    map.fitBounds(group.getBounds().pad(1), {animate: false})
    map.panBy([0, qrContext?.mapOffset || 0], {animate: false});
  }
  $: {
    if($positionStore
      && nearestElement
      && map
    ) {
      autoPositionMap();
    }
  }

  onDestroy(()=>{
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

  $: if(mapFocus && map) {
    console.log(mapFocus)
    let location = false
    if (mapFocus?.values?.position?.lat) {
      location = mapFocus?.values?.position
    }
    else if (mapFocus?.lat) location = mapFocus
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
    background-image: url("../icons/map_marker_tip.svg");
    background-repeat: no-repeat;
    background-position: bottom center;
    width: 49px;
    height: 42px;
  }

  :global(div.marker-container.no-pointer) {
    background-image: none;
  }

  :global(div.marker-content) {
    width: 49px;
    height: 32px;
    background-color: #fff;
    border: 1px solid black;
    border-radius: 12px;
    font-size: var(--font-size-regular);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }

  :global(div.marker-content img) {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  :global(.marker-content.selected) {
    background-color: lightgrey;
  }

  :global(.marker-content.selected img) {
    filter: grayscale(1);
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
