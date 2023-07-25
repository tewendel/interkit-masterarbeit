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
  // please note we cannot use Svelte components here, as it is rendered by leaflet
  
  /* options:
      markerIconAsset // the icon to use for a regular marker
      selected // change the color when you press it
      checked // show a check mark on the marker
      markerCheckedIconAsset // the icon to use when checked
      noPointer // hide the little pointer at the bottom

      from the element we get the title, label and custom icon

  */

  const getRemPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  
  export const createIconDivHTML = async (element, options, index) => {

    //console.log("createIconDivHTML", element, options)

    let title = element?.markerTitleColumn;
    let label = element?.markerLabelColumn;
     
    // get custom marker icon if available
    let mediafileRef = element?.customIconColumn;
    let mediafile;
    if(mediafileRef)
      mediafile = await InterkitClient.getMediaFile(mediafileRef.value); // this should probably be cashed locally on the client
    let iconSrc = mediafile?.link || options.markerIconAsset;
    let hasMediafileIcon = !!mediafile?.link

    // hide the frame if we don't have a label or an image to show
    let noFrame = !label && !mediafile?.link;

    // when dummyData is set, mix different variants
    if (options.showDummyData) {
      // add labels on some markers
      if (index % 4 < 2) {
        label = index
        noFrame = false
      }
      // add images on some markers
      if (index % 2 === 0) {
        mediafile = {link: "123"}
        iconSrc = "data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='208' fill='none'%3E%3Cpath fill='%23FFDBD3' d='M0 0h380v208H0z'/%3E%3C/svg%3E"  
        noFrame = false
        hasMediafileIcon = true
      }
      if (noFrame && !mediafile?.link && label) {
        iconSrc = null;
        hasMediafileIcon = false
      }
      options.checked = index % 3 !== 0;
    }

    // change style when marker is tapped
    let markerSelected = false;
    if(options.selected)
      markerSelected = true; 

    const labelSpan = label ? `<span class="MapRenderer__MarkerLabel marker-content-label">${label}</span>`: "";

    const titleDiv = title
      ? `<div class="MapRenderer__MarkerTitle marker-title ${markerSelected ? 'selected' : ''}">${title}</div>`
      : ''
    
    const checkMark = options.checked ? `<span class="MapRenderer__Checkmark check-mark"></span>`: "";

    // only hide the image if there's no mediaFile but a marker
    const image = !mediafile?.link && label ? "" : `<img class="MapRenderer__Image" src="${iconSrc}"/>`;

    let html = `
    <div class="marker-container MapRenderer__Markers
      ${hasMediafileIcon ? 'Maprederer__Markers--hasmediaicon has-mediafileicon' : ''}
      ${options.noPointer ? 'MapRenderer__Markers--nopointer no-pointer' : ''}
      ${!label ? 'MapRenderer__Markers--nolabel no-label' : ''}
      ${noFrame ? 'MapRenderer__Markers--noframe no-frame' : ''}
      ${options.checked ? 'MapRenderer__Markers--checked checked' : ''}
    ">
      ${titleDiv}
      <div class="marker-content MapRenderer__MarkersContent
        ${markerSelected ? 'MapRenderer__MarkersContent--selected selected' : ''}
        ">
        ${checkMark}
        ${labelSpan} 
        ${image}
      </div>
    </div>
    `;
    
    return html
  }

</script>

<script>

  import { onMount, getContext, setContext, onDestroy } from 'svelte'

  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  const showDummyData = getShowDummyDataStore()

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

  import markerIconAsset from "./icons/Full/Location.svg?url"; // default asset to use
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

    const remPx = getRemPx()

    // clear old markers
    removeMarkers();

    if(!markerData) return;

    // for showDummyData
    let markerIndex = 0;

    // setup new markers
    for(let markerValue of markerData) {

      //console.log("markerValue", markerValue)

      if(markerValue.location) {
        
        let iconHTML = await createIconDivHTML(markerValue.element, {
          checked: markerValue.checked,
          selected: markerValue.selected,
          markerCheckedIconAsset,
          markerIconAsset,
          showDummyData: $showDummyData
        }, markerIndex);

        markerIndex++;

        let icon = L.divIcon({
          html: iconHTML,
          className: 'map-marker',
          iconAnchor: [(24.5 / 16) * remPx, (42 / 16) * remPx]
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

        if(!userIcon) {
          const remPx = getRemPx()
          userIcon = L.divIcon({
            html: "<div class='user_pos_marker'><img class='user_pos' src='leaflet/user_pos.svg'></div>",
            iconUrl: "leaflet/user_pos.svg",
            iconSize:     [(60 / 16) * remPx, (60 / 16) * remPx], 
            iconAnchor:   [(30 / 16) * remPx, (30 / 16) * remPx], 
          });
        }

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

<!-- TODO cleanup old Map__* classes+s tyles -->
<div 
    class="MapRenderer Map__Container container" 
    class:hasHeading={combinedHeading !== false}
    class:MapRenderer--hasheading={combinedHeading !== false}
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
    <div class="MapRenderer__Controls Map__Controls controls">

      <button class="MapRenderer__ZoomIn Map__Controls__ZoomIn zoomIn">
        <Button on:click={zoomIn} dummyNoText>
          <Icon type="Thin-Plus" />
        </Button>
      </button>

      <button class="MapRenderer__ZoomOut Map__Controls__ZoomOut zoomOut">
        <Button on:click={zoomOut} dummyNoText>
          <Icon type="Thin-Minus" />
        </Button>
      </button>

      <button class="MapRenderer__Locate Map__Controls__Locate locate" id="locateButton">
        <Button on:click={panToUserPosition} dummyNoText>
          <Icon type="Thin-Position" />
        </Button>
      </button>

    </div>
  {/if}
  
  
  <div class="map MapRenderer__Map" id={mapId} bind:this={mapElement}></div>

</div>

<style>
  
  /* We can't use --inset vars here because the markers are placed
   * pixel-perfectly to their JS-set anchor (see above).
   * inset would affect the height (or the image would have to shrink significantly).
   * The markers barely support rem anyway...
   */

  .container {
    width: 100%;
    height: 100%;
    flex: 1;
  }

  .map { 
    height: 100%;
    width: 100%;
    /* for rounded corners in Safari https://github.com/Leaflet/Leaflet/issues/1549#issuecomment-62906881 */
    z-index: 0;
  }

  #locateButton:hover {
    cursor: pointer;
  }

  /* marker container */

  :global(div.marker-container) {
    background-image: url("../icons/map_marker_tip.svg");
    background-repeat: no-repeat;
    background-position: bottom center;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 3rem;
    height: 2rem;
  }

  :global(div.marker-container.no-frame) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
  }

  :global(div.marker-container.no-pointer) {
    background-image: none;
  }

  :global(.marker-container.no-frame:not(.no-label)) {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  /* marker content - the body of the marker */

  :global(.marker-container:not(.no-frame) div.marker-content) {
    position: relative;
    padding: 0.125rem;
    background-color: var(--color-background);
    border: var(--border-width) solid var(--color-border);
    /* add padding here                                        v */
    border-radius: calc(var(--border-radius-mapmarker-inner) + 0.125rem);
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.125rem;
    min-width: 2rem;
    box-sizing: border-box;
  }

  :global(.marker-container:not(.no-frame) div.marker-content.selected) {
    background-color: var(--color-background-button-pressed);
  }

  :global(.marker-container.no-frame .marker-content) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* check mark */

  :global(div.marker-container .check-mark) {
    background-color: var(--color-background);
    background-image: url("./icons/Full/Check.svg");
    filter: invert(1);
    background-repeat: no-repeat;
    background-size: 0.75rem;
    background-position: center;
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 100%;
    display: inline-block;
    position: absolute;
    z-index: 1000;
    right: -0.375rem;
    top: -0.375rem;
  }

  :global(div.marker-container.no-frame .check-mark) {
    right: 0.5rem;
    top: 0.1rem;
  }

  :global(div.marker-container.no-label div.marker-content) {
    width: 2rem;
    padding: 0.125rem;
  }

  /* image */

  :global(div.marker-content img) {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: cover;
    border-radius: var(--border-radius-mapmarker-inner);
  }

  :global(.marker-container:not(.has-mediafileicon) .marker-content.selected img) {
    filter: grayscale(1) brightness(0.5);
  }

  :global(.marker-content.selected img[src$='Location.svg']) {
    /* this only works for a black img... */
    filter: grayscale(1) invert(1) brightness(0.5);
  }


  /* little tip at the bottom */

  :global(.marker-container:not(.no-frame) div.marker-content::after) {
    content: "";
    box-sizing: border-box;
    display: block;
    position: absolute;
    z-index: -1;
    top: 100%;
    left: calc(50% - 0.4375rem);
    width: 0.9375rem;
    height: 0.625rem;
    border-top: 0.625rem solid var(--color-border);
    /* note: the tip is not perfectly rounded, but at 1px this shouldn't matter */
    border-left: 0.4375rem solid transparent;
    border-right: 0.4375rem solid transparent;
  }

  /* title above the body */

  :global(div.marker-title) {
    position: absolute;
    top: -1.4rem;
    left: 50%;
    white-space: nowrap;
    transform: translateX(-50%);
    max-width: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    /* TODO this is not to spec, which is not blurry + un-hardcode color. */
    text-shadow: 0 0 0.0625em var(--color-background);
  }
  
  :global(.marker-container.no-frame .marker-title) {
    top: -0.9rem;
  }

  :global(.leaflet-control) { /* hide default leaflet controls */
    display: none;
  }

  .controls {
    position: absolute;
    right: 0;
    /*bottom: calc(50% - 3rem - var(--outset-y) * 1rem);*/
    bottom: calc(50% - 4rem);
    display: flex;
    flex-direction: column;
    z-index: 1;
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem)
      0.5rem
      calc(var(--outset-x) * 0.5rem);
  }

  .controls > * {
    /*margin:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem);*/
    margin:
      0.5rem
      calc(var(--outset-x) * 0.5rem);
  }
  .controls .locate {
    /*margin-top: calc(var(--outset-y) * 1rem + 1.5rem)*/
    margin-top: 2.5rem;
  }

  :global(.leaflet-div-icon) {
    background: transparent !important;
    border: none !important;
  }

  :global(.user_pos_marker) {
    width: 3.75rem;
    height: 3.75rem;
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
    width: 1.25rem;
    height: 1.25rem;
    animation: pulsate 5s;
    animation-iteration-count: infinite; 
  }

  @keyframes pulsate {
    0% {transform: scale(1);}
    20% {transform: scale(1.3);}
    40% {transform: scale(1);}
  }
  
</style>
