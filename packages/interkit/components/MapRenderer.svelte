<script context="module">

  /**
   * Notes on headings, by geolocation (movement/walking/driving through space),
   * and by compass ("magnetic", independent of movement):
   *
   * The Geolocation Plugin should take care of asking for permissions, even if
   * this looks weird in the implementation.
   *
   * For compass, we use the standard `deviceorientation` event/API.
   * There is also the Capacitor Motion plugin, which is only a thin wrapper,
   * around the older, more cumbersome `devicemotion` event/API.
   * There *could* be permission, or other problems, but so far this seems to work.
   * An alternative could be https://github.com/apache/cordova-plugin-device-orientation
   * (or its future Capacitor adaptation:
   * https://github.com/ionic-team/capacitor-plugins/issues/718).
   * Note also that this can be hard to test: `deviceorientation` requires a
   * "secure context", so https in browser, which can be hard to provide in
   * live/dev/watch/HMR modes. A compiled iOS/Android app's virtual localhost origin
   * seems to work fine for now. So to test, deploy the app to device or try to proxy
   * the live server through https.
   * 
   * Check the notes in the code for how we (hopefully) smartly mangle geo+compass,
   * esp. the `combinedHeading` variable.
   * Use the `debugGeo` constant; see annotations there on how to read the info.
   */

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

    let title = element?.markerTitleColumn;
    let label = element?.markerLabelColumn;

    let labelSpan = label ? `<span class="marker-content-label">${label}</span>`: "";
    
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

    const titleDiv = title
      ? `<div class="marker-title ${markerSelected ? 'selected' : ''}">${title}</div>`
      : ''

    let html = `
    <div class="marker-container ${options.noPointer ? 'no-pointer' : ''}">
      ${titleDiv}
      <div class="marker-content
        ${!label ? 'marker-content__no-label' : ''}
        ${markerSelected ? 'selected' : ''}
        ${options.checked ? 'checked' : ''}
        ">${labelSpan} <img src="${iconSrc}"/></div>
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
  export let enableGeolocationHint;
  export let height; // height of the container
  export let showControls; // true if we should show controls
  export let mapId; // id of the map

  export let markerData; // the markers to show
  export let mapFocus; // the marker to center the map on
  export let markerClick;
  export let mapClick;

  import markerIconAsset from "./icons/Thin/Location.svg?url"; // default asset to use
  import markerCheckedIconAsset from "./icons/Thin/Check.svg?url"; // checked asset

  export let defaultLocation; // where to center the map by default [lat, lng]
  
  export let nearestElementMode = false;
  export let nearestElement;
  export let disableControls = false;

  export let tileLayer;
  export let mapBoxGLStyle;  
  
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

  /**
   * Flag to display an overlay with current values
   * Please check the template for info how to read them
   */
  const debugGeo = false

  /**
   * Speed of the device in m/s, as reported by Capacitor's Geolocation API
   */
  let currentSpeed

  /**
   * Speed of the device in m/s, logarithmically smoothed
   */
  let smoothSpeed = 0.0

  /**
   * Clamped to sensible values (noise cut-off, max speed) and normalized [0.0..1.0],
   * see other comment for exact calculation and magic values.
   * Is then used to lerp between compass and geo (movement) direction:
   * When 0.0 (user not moving, or moving very slowly), compass has precedence
   * When 1.0 (user walking fast), geo direction has precedence
   */
  let normalizedSpeed = false

  /**
   * Direction as reported by the compass, in degrees
   */
  let compassHeading = false

  /**
   * Direction (of movement in space) in degrees, as reported by Capacitor's Geolocation API
   */
  let geoHeading = false

  /**
   * Holds the lerped direction in degrees
   */
  let combinedHeading

  const deviceorientationListener = evt => {
    if (evt.alpha && typeof evt.alpha === 'number') {
      compassHeading = 360.0 - evt.alpha
      return
    }
    compassHeading = false
  }

  /**
   * lerp between two angles. f1 + f2 =should= 1.0
   * @param {number} a1 first angle
   * @param {number} a2 second angle
   * @param {number} f1 "influence" of first angle
   * @param {number} f2 "influence" of first angle
   */
  const vlerpAngles = (a1, a2, f1, f2) => {
    a1 = a1 * Math.PI / 180
    a2 = a2 * Math.PI / 180
    return Math.atan2(
      Math.sin(a1) * f1 + Math.sin(a2) * f2,
      Math.cos(a1) * f1 + Math.cos(a2) * f2
    ) * 180 / Math.PI
  }

  $: {
    if (compassHeading !== false && geoHeading !== false) {
      combinedHeading = vlerpAngles(
        compassHeading, geoHeading,
        1.0 - normalizedSpeed, normalizedSpeed
      )
    } else {
      combinedHeading = geoHeading || compassHeading
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

  let lastErrorCode;

  // active user position tracking
  const activateGeoWatch = () => {

    if(geoWatch) {
      console.log("position is already being tracked, aborting", geoWatch)
      return;
    }

    console.log("activating geoWatch")

    geoWatch = Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
      if(position) {
        currentPosition = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude, 
          heading: position.coords.heading,
          speed: position.coords.speed,
        }

        if ('speed' in currentPosition && typeof currentPosition.speed === 'number') {
          currentSpeed = currentPosition.speed
          smoothSpeed = currentSpeed * 0.5 + smoothSpeed * 0.5
          /* speed comes in meters per second, we clamp it between [0.5..2] and normalize
           * i.e. speed<1.8km/h -> 0, speed>7.2km/h -> 1
           */
          normalizedSpeed = Math.min(1.0, Math.max(0.0, smoothSpeed - 0.5) / 1.5)
          if (currentPosition.speed > 0) {
            geoHeading = currentPosition?.heading !== false && currentPosition.heading !== null
              ? currentPosition.heading
              : false
          }
        }

        // console.log('geoHeading', geoHeading, 'smoothSpeed', smoothSpeed, 'normalizedSpeed', normalizedSpeed, "currentPosition", JSON.stringify(currentPosition), err)

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
  }

  onMount(async ()=>{

    /* basic map setup */
    
    map = L.map(mapId, {
      zoomControl: false,
      maxZoom: 20,
      attributionControl: false,
    }).setView(singleElement?.markerPositionsColumn ? singleElement.markerPositionsColumn : defaultLocationLatLng, 
     singleElement ? 17 : 13);  

    if(qrContext) {
      console.log("qrContext", qrContext)
      map.panBy(qrContext?.mapOffset, {animate: false});
    }

    if(disableControls) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable(); 
    }

    if (tileLayer) {
      // default interkit map style
      console.log("using tileLayer", tileLayer)
      L.tileLayer(tileLayer, {
        maxZoom: 20
      }).addTo(map);
    } else {
      L.maplibreGL({
        // attribution: 'TODO',
        style: mapBoxGLStyle,
      }).addTo(map);
    }

    map.on("click", mapClick);

    if(!$bottomMenuKey) {
      console.log("no bottom menu found, actviating geoWatch")
      activateGeoWatch();
      window.addEventListener('deviceorientation', deviceorientationListener)
    }
    
    /* autoposition map if user doesnt interact */
    map.on('zoomstart', function() {
      manualPosition = true;  
    })
    map.on('dragstart', function() {
      manualPosition = true;
    })
  })

  const autoPositionMap = () => {
    if(defaultLocation) return;
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

  $: {
    if(singleElement && map) {
      console.log("move map to single element")
      if(singleElement.markerPositionsColumn) {
        map.setView(singleElement.markerPositionsColumn, 17)
      }
    }
  }

  onDestroy(() => {
    console.log('MapRenderer destroy')
    Geolocation.clearWatch(geoWatch)
    window.removeEventListener('deviceorientation', deviceorientationListener)
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
        } else {
          // granted but not enabled
          alert(enableGeolocationHint)
          console.log("currentPosition", currentPosition)
        }
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


  const bottomMenuKey = InterkitClient.getUiKeyStore("bottomMenuKey");    

  /* observe bottom menu state to enable and disable map watchers */
  $: {
    if($bottomMenuKey == "map" && map) {
      console.log("bottomMenuKey updated - show map")
      map.invalidateSize();
      activateGeoWatch();
      window.addEventListener('deviceorientation', deviceorientationListener)
    }
    if($bottomMenuKey && $bottomMenuKey != "map" && map) {
      console.log("bottomMenuKey updated - away from map")
      if(geoWatch) {
        console.log("disabling geoWatch", geoWatch)
        Geolocation.clearWatch(geoWatch)
        geoWatch = null;
        window.removeEventListener('deviceorientation', deviceorientationListener)
      }
    }
  }


</script>

<div 
    class="Map__Container container" 
    class:hasHeading={combinedHeading !== false}
    style={`--map-heading: ${combinedHeading || 0}deg; height: ${height};`}
  >
  {#if debugGeo}
    <div style="position: fixed; z-index: 10000; top: 0; left: 0; color: red">
      <!-- comb = lerped sum of geo+comp, by normSpd factor -->
      <b>comb</b>/geo/comp<br/>
      <b>{ typeof combinedHeading === 'number' ? Math.round(combinedHeading) : combinedHeading }</b>
      { typeof geoHeading === 'number' ? Math.round(geoHeading) : geoHeading }
      <!-- hint: if compassHeading is false, deviceorientation fails. insecure context? no https? -->
      { typeof compassHeading === 'number' ? Math.round(compassHeading) : compassHeading }<br/>
      currSpd/smthSpd/<b>normSpd</b><br/>
      <!-- speeds in m/s. smth is log-smoothed over time; norm is noise-clamped and normalized -->
      <!-- normSpd is lerp factor. 0 => use comp, 1 => use geo, sum goes to comb -->
      { Math.round(currentSpeed * 100) / 100 }
      { Math.round(smoothSpeed * 100) / 100 }
      <b>{ Math.round(normalizedSpeed * 100) / 100 }</b>
    </div> 
  {/if}

  {#if showControls}
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
    /* for rounded corners in Safari https://github.com/Leaflet/Leaflet/issues/1549#issuecomment-62906881 */
    z-index: 0;
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
    position: relative;
  }

  :global(div.marker-container.no-pointer) {
    background-image: none;
  }

  :global(div.marker-content) {
    position: relative;
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

  :global(div.marker-content::after) {
    content: "";
    box-sizing: border-box;
    display: block;
    position: absolute;
    z-index: -1;
    top: 100%;
    left: calc(50% - 7px);
    width: 15px;
    height: 10px;
    border-top: 10px solid var(--color-border);
    /* note: the tip is not perfectly rounded, but at 1px this shouldn't matter */
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }

  :global(div.marker-content img) {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  :global(div.marker-content.marker-content__no-label img) {
    width: 32px;
    height: 32px;
  }

  :global(div.marker-content.checked img) {
    width: 24px;
    height: 24px;
  }


  :global(div.marker-title) {
    position: absolute;
    top: -1.8em;
    left: 50%;
    white-space: nowrap;
    transform: translateX(-50%);
    max-width: 12em;
    overflow: hidden;
    text-overflow: ellipsis;
    /* TODO this is not to spec, which is not blurry + un-hardcode color. */
    text-shadow: 0 0 1px #e5e5e5;
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
    z-index: 1;
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
