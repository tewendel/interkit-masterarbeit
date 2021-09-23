<script context="module">
  export const MAP = {}; // context identifier
</script>

<script>

  import { onMount, setContext, onDestroy } from 'svelte'
  import { get } from 'svelte/store'
  import { fly } from 'svelte/transition';
  
  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  import MapFilterControls from './MapFilterControls.svelte'
  import MapLayerControls from './MapLayerControls.svelte'
  import MapActiveOverlayButtons from './MapActiveOverlayButtons.svelte'

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  //import 'leaflet.tilelayer.colorfilter';
  import 'leaflet.tilelayer.gl';
  import { desaturateShader } from './mapShaders.js'

  import { Plugins, Capacitor } from '@capacitor/core';
  const { Geolocation, Permissions } = Plugins;

  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerIconAsset = "icons/Location.svg"; // path to default asset we use for marker icon

  export let markerSelectedIconAsset = "icons-gate/map_marker_selected.svg";
  export let markerCheckedIconAsset = "icons-gate/map_marker_checked.svg";
  export let markerCheckedSelectedIconAsset = "icons-gate/map_marker_checked_selected.svg";
  export let markerPlayingIconAsset = "icons-gate/map_marker_playing.svg";
  export let markerPlayingSelectedIconAsset = "icons-gate/map_marker_playing_selected.svg";

  export let customIconColumn; // a custom mediafile as icon for each element
  export let markerLabelColumn; // a short custom string for the marker (eg "01")

  export let defaultLocation; // where to center the map [lat, lng]
  // what to tell the user when there is no permission for gps
  export let permissionNotification = "Die App hat keine Erlaubnis, ihre Position festzustellen. Unter Start > Einstellungen > FAQ finden Sie eine Anleitung, um die Erlaubnis für Ihr Gerät zu erteilen.";

  export let mainLayerLabel = "Ebenen";

  export let defaultBaseColor = [0.74, 0.79, 0.85];

  export let hideOnMapColumn;


  let defaultLocationLatLng = [51.505, -0.09];
  if(defaultLocation) {
    try {
      defaultLocationLatLng = JSON.parse(defaultLocation)
      //console.log("defaultLocationLatLng", defaultLocationLatLng)
    } catch(e) {
      console.log("error parsinng defaultLocation")
    }
  }
  
  let filterLists = []; // array containing filterlists registered via slot
  let activeFilter;

  let layers = []; // array containing layers that were registered via slot
  let activeLayer;
  let imageOverlay;
  
  let map;
  let labels_layer; // layer for street names
  let mapElement; 
  let markerIcon;
  let markerIconSelected;
  let markerIconChecked;
  let markerIconCheckedSelected;
  let markerIconPlaying;
  let userIcon;
  let userPositionMarker;
  let markers = [];
  let hideMarkers = false; // option to hide all markers
  let satLayer; // this is a special webgl layer to color satellite tiles
  let geoWatch;
  let currentPosition;
  let hasHeading = false // heading direction

  let selectedElement;
  let controlsFocus = null; // which of the controls is focused -> hide the submenu of the other

  let elementRows; // store with the elements we want to show
  let unsubElementRows; // unsubscribe method to this store
  let markerRows;

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  const mapFocus = InterkitClient.getGlobalStore("mapFocus")
  const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")

  // store of projectid
  let projectId = InterkitClient.projectId;

  
  // context for MapCategoryFilter components to register themselves
  setContext(MAP, {
    registerFilter: async ({name, categoryNameColumn, categoryColorColumn, categoryUnlistedColumn, elementRefColumn, categoryOrderColumn, filterKeyColumn, connectedLayerKeyColumn}) => {

      //console.log("registerFilter", name, categoryNameColumn, elementRefColumn, categoryColorColumn)

      // get the sheetId of the sheet with the categories
      const filterCategorySheetKey = util.getSheetKey(categoryNameColumn);
      
      // get the categories that we can filter for with this filter
      const categoryRowStore = await InterkitClient.getRowSubStore(filterCategorySheetKey);
      const unlistedFilter = r => !util.rowVal(r, categoryUnlistedColumn)
      
      // add the filter to our collection
      filterLists.push({
        name,
        filterCategorySheetKey,
        categoryRows: get(categoryRowStore)?.filter(unlistedFilter),
        categoryNameColumn,
        categoryColorColumn,
        elementRefColumn,
        categoryOrderColumn,
        filterKeyColumn, 
        connectedLayerKeyColumn 
      })
      filterLists = filterLists;
      
      // update the filterlist when new categories are added
      categoryRowStore.subscribe((data) => {
        let filter = filterLists.find(l => l.name == name);
        if(filter)
          filter.categoryRows = data?.filter(unlistedFilter)
        filterLists = filterLists;
      });
    },

    registerLayer: async (layerData) => {
      // add the layer to our collection
      layers.push(layerData)
      layers = layers;
    }
  });

  const markerClick = async (e) => {
    console.log("marker clicked", e.target?.payload);
    //await playAudio(e.target?.payload?.elementRow)

    selectedElement = {
      ...e.target?.payload?.elementRow,
      onPlay: () => {selectedElement = null}
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

  // assembles html to pass to leaflet for a custom marker div
  const createIconDiv = async (markerValue) => {

    let label = util.rowVal(markerValue.elementRow, markerLabelColumn);
    
    let mediafileRef = util.rowVal(markerValue.elementRow, customIconColumn);
    let mediafile = await InterkitClient.getMediaFile(mediafileRef.value); // this should probably be cashed locally on the client
    let iconSrc = mediafile?.link || markerIconAsset;
    
    let html = `
    <div class="marker-container">
      <span>${label}</span> <img src="${iconSrc}"/>
    </div>
    `;
    
    return L.divIcon({
      html,
      className: 'map-marker'
    });
  }

  const updateMarkers = async () => {

    //console.log("activeFilter", activeFilter, markerRows);

    // filter rows
    let rowsFiltered = markerRows.filter(r => 
      (!activeFilter ||
      util.rowVal(r, activeFilter.elementRefColumn)?.rowKeys?.includes(activeFilter.row.key))
      && 
      (!hideOnMapColumn || 
      util.rowVal(r, hideOnMapColumn) != "true")
    )

    // prepare data for marker production and audio playback when clicked
    let markerValues = rowsFiltered.map(r=> {return {
      location: (util.rowVal(r, markerPositions)?.lat
                && util.rowVal(r, markerPositions)?.lng ?
                util.rowVal(r, markerPositions) : undefined),
      elementRow: r
    }})

    // clear old markers
    removeMarkers();

    if(!hideMarkers) {

      // setup new markers
      for(let markerValue of markerValues) {
        if(markerValue.location) {
          let markerOptions = {
            title: markerValue.title,
          }

          // change size when marker is tapped
          if(markerIcon) {
            markerOptions.icon = (selectedElement && selectedElement?.key === markerValue?.elementRow?.key ) ? markerIconSelected : markerIcon;
          }

          // show checked for markers that are on bookmarks list
          if($elementProperties?.[markerValue.elementRow.key]?.checked) {
            markerOptions.icon = (selectedElement && selectedElement?.key === markerValue?.elementRow?.key ) ? markerIconCheckedSelected : markerIconChecked;
          }

          // show play icon on markers that are in the audio player
          if(markerValue?.elementRow?.key == $audioPlayerElement?.key) {
            markerOptions.icon = markerIconPlaying;  
          }

          let icon = await createIconDiv(markerValue);
          let marker = L.marker(markerValue.location, {icon}).addTo(map)
          
          marker.payload = markerValue;
          marker.on('click', markerClick);
          markers.push(marker);  
        }
      }
      // this probably needs to be much more efficient
    }
  }

  $: {
    $audioPlayerElement; // trigger function run
    $elementProperties; // trigger function run 
    selectedElement; // trigger function run
    if(markerRows) {
      updateMarkers();
    }
  }

  onMount(async ()=>{
    //console.log("onMount map")

    L.Icon.Default.imagePath = '/leaflet/'

    map = L.map('mapid', {
      zoomControl: false,
      attributionControl: false,
    }).setView(defaultLocationLatLng, 14);  

    // default interkit map style
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on("click", mapClick);

    // satellite and label layers from THE GATE Project
    /*let esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    let esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

    // Instantiate our L.TileLayer.GL...
    satLayer = L.tileLayer.gl({
      uniforms: {
        uRGB: defaultBaseColor
      },
      fragmentShader: desaturateShader,
      tileUrls: [esriUrl],
      //attribution: esriAttr
    }).addTo(map);*/

    /*let cartodbAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    let labelUrl = 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png'
    labels_layer = L.tileLayer(labelUrl, {
      id: 'cartodb_labels', 
      //attribution: cartodbAttr
    }).addTo(map)*/

    /*labels_layer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
      //attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a //href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; 
      //<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });
    labels_layer.addTo(map)
    */

    /* set up marker icons */

    // load the marker icon
    if(markerIconAsset) {
      markerIcon = L.icon({
        iconUrl: markerIconAsset,
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
      });
    }

    // selected icon
    if(markerSelectedIconAsset) {
      markerIconSelected = L.icon({
        iconUrl: markerSelectedIconAsset,
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
      });
    } else markerIconSelected = markerIcon

    // checked icon
    if(markerCheckedIconAsset) {
      markerIconChecked = L.icon({
        iconUrl: markerCheckedIconAsset,
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
      });
    } else markerIconChecked = markerIcon

    // checked selected icon
    if(markerCheckedSelectedIconAsset) {
      markerIconCheckedSelected = L.icon({
        iconUrl: markerCheckedSelectedIconAsset,
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
      });
    } else markerIconCheckedSelected = markerIconChecked

    // playing icon
    if(markerPlayingIconAsset) {
      markerIconPlaying = L.icon({
        iconUrl: markerPlayingIconAsset,
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
      });
    } else markerIconPlaying = markerIcon

    // playing selected icon
    if(markerPlayingSelectedIconAsset) {
      markerIconPlaying = L.icon({
        iconUrl: markerPlayingSelectedIconAsset,
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
      });
    } else markerIconPlayingSelected = markerIconPlaying

    
    /* watch data changes for marker updates */

    let sheetKey;
    if(markerPositions) {
      sheetKey = util.getSheetKey(markerPositions)
    }
    
    //console.log(sheetId, positionColumnKey, labelColumnKey)
    if(sheetKey) {
      elementRows = await InterkitClient.getRowSubStore(sheetKey);
      unsubElementRows = elementRows.subscribe((rowsArray)=>{
        markerRows = rowsArray;
        updateMarkers();
      })
    }

    /* watch user position */

    //const coordinates = await Geolocation.getCurrentPosition();
    //console.log('Current Position', coordinates);
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

  const setFilter = (filter) => {
    controlsFocus = null;
    activeFilter = filter;
    hideMarkers = false;
    updateMarkers();

    /*
    // recoloring of satellite layer from THE GATE project
    let colorRGBArray;
    if(filter) {
      let colorRGB = util.rowVal(filter.row, filter.categoryColorColumn);
      try {
        colorRGBArray = JSON.parse(colorRGB)
      } catch(e) {
        console.info("error parsing colorRGBArray")
      }
    }
    */
    
    // update colorization 
    /*
    if(filter && colorRGBArray) {
      satLayer.setUniform("uRGB", colorRGBArray);
      satLayer.reRender();
    } else {
      satLayer.setUniform("uRGB", defaultBaseColor);
      satLayer.reRender();
    }
    */

    // check for connected layer
    if(filter) {
      let connectedLayerKey = util.rowVal(filter.row, filter.connectedLayerKeyColumn);
      if(connectedLayerKey) {
        console.log("connected layer key detected", connectedLayerKey)
        // iterate over layers
        for(let layer of layers) {
          if(layer.layerKey == connectedLayerKey) {
            console.log("layer found, activating...")
            setLayer({...layer, connectedFilterKey: undefined});
          }
        }
      }
    }
        
  }

  // set the image overlay layer
  const setLayer = (layer) => {
    controlsFocus = null;
    mapLayerControlsExpanded = false; // close filter & layer panel
    if(imageOverlay) {
      map.removeLayer(imageOverlay);
    }
    activeLayer = layer;
    console.log(layer);

    if(layer) {
      let imageUrl = layer.assetPath;
      //let imageBounds = map.getBounds();
      let imageBounds;

      try {
        imageBounds = [
          JSON.parse(layer.topLeft),
          JSON.parse(layer.bottomRight)
        ]
        console.log(imageBounds)
      } catch(e) {
        console.log("error parsing layer bounds")
      }
      if(imageBounds)
        imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

      if(layer.hideLabels == "TRUE")
        map.removeLayer(labels_layer)

      // check for connected filter
      if(layer.connectedFilterKey) {
        console.log("connected filter detected", layer.connectedFilterKey)
        // find the corresponding filter
        // iterate over filterLists
        for(let filterList of filterLists) {
          // in each filterList go over filters and check if filterKey is connnected
          for(let categoryRow of filterList.categoryRows) {
            let filterKey = util.rowVal(categoryRow, filterList.filterKeyColumn);
            if(filterKey == layer.connectedFilterKey) {
              console.log("connected filter found, activating...")
              setFilter({
                name: util.rowVal(categoryRow, filterList.categoryNameColumn),
                row: categoryRow,
                categoryColorColumn: filterList.categoryColorColumn,
                elementRefColumn: filterList.elementRefColumn
              })
            }
          }
        }        
      }

      if(layer.hideMarkers == "TRUE") {
        console.log("hiding all markers...");
        hideMarkers = true;
      } else {
        hideMarkers = false;
      }

    } else {
      hideMarkers = false;
      if(!map.hasLayer(labels_layer)) {
          labels_layer.addTo(map);
      }
    }

    updateMarkers();
  }

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

  const closeControls = () => {
    controlsFocus = null;
  }


  $: if($mapFocus) {
    console.log($mapFocus);
    let location = false
    selectedElement = null
    activeFilter = null
    if ($mapFocus?.values?.position?.lat) {
      location = $mapFocus?.values?.position
      selectedElement = null;
      //setTimeout(()=>
      //selectedElement = $mapFocus
      //,1000)
    }
    else if ($mapFocus?.lat) location = $mapFocus
    if (location) {
      map.panTo({lat: location.lat, lng: location.lng}, {animate: false});
      map.setZoom(16);
    }
  }

  $: hasHeading = currentPosition && currentPosition?.heading !== false && currentPosition.heading !== null && currentPosition?.speed > 0

  let mapLayerControlsExpanded = false; // is the layer controls panel open?`

</script>

<div 
    class="Map__Container container" 
    class:hasHeading
    style={`--map-heading: ${currentPosition?.heading || 0}deg;`}
  >

  <slot name="filters"></slot>
  <slot name="layers"></slot>

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

  {#if layers.length || filterLists.length}
    <div class="Map__LayerControls layer_controls">

      <div class="Map__LayerControls__Info layer_info">
        <span class="Map__LayerControls__Text">
          Filters & Layers 
        </span>
        <span class="Map__LayerControls__FiltersActive" data-number={activeFilter ? "1" : "0"}>
          (1 filter active) 
        </span>
        <span class="Map__LayerControls__LayersActive" data-number={activeLayer ? "1" : "0"}>
          (1 layer active) 
        </span>
        <span class="Map__LayerControls__TextAfter">
        </span>
      </div>

      <div class="Map__LayerControls__Expanded layer_controls_expanded" class:expanded="{mapLayerControlsExpanded}">

        <MapFilterControls
          on:click={() => controlsFocus="filters"}
          isFocused={controlsFocus=="filters"}
          onClose={closeControls}
          {filterLists}
          {setFilter}
          {activeFilter}      
        />

        <MapLayerControls
          on:click={() => controlsFocus="layers"}
          isFocused={controlsFocus=="layers"}
          onClose={closeControls}
          {layers}
          {setLayer}
          {activeLayer}
          elementRows={$elementRows}
          {mainLayerLabel}
        />

      </div>

      <div class="Map__LayerControls__PanelControls panel_controls" data-state={mapLayerControlsExpanded ? "opened" : "closed"}>
        <Button on:click={()=>mapLayerControlsExpanded = !mapLayerControlsExpanded}>
          {#if !mapLayerControlsExpanded}
            <span class="Map__LayerControls__PanelControls__Open">
              Open
            </span>
          {:else}
            <span class="Map__LayerControls__PanelControls__Close">
               Close
             </span>
          {/if}
        </Button>
      </div>

      <MapActiveOverlayButtons
        {activeFilter}
        {activeLayer}
        {setFilter}
        {setLayer}
        elementRows={$elementRows}
      />

    </div>
  {/if}

  {#if !mapLayerControlsExpanded}
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
  
  <div id="mapid" bind:this={mapElement}></div>

</div>

<style>

  .container {
    height: 100%;
    width: 100%;
  }

  #mapid { 
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
    display: none;
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

  .Map__LayerControls__PanelControls__Open:before {
    content:  "▼ ";
  }
  
  .Map__LayerControls__PanelControls__Close:before {
    content:  "▲ ";
  }

  .Map__LayerControls__FiltersActive[data-number="0"] {
    display: none;
  }

  .Map__LayerControls__LayersActive[data-number="0"] {
    display: none;
  }

  .controls > * {
    margin: 8px;
  }
  .controls .locate {
    margin-top: 40px;
  }

  .layer_info {
    background-color: white;
    padding:  8px;
    width: 100vw;
  }

  .layer_controls {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1000;
  }

  .layer_controls_expanded {
    display: none;
  }

  .layer_controls_expanded.expanded {
    display : block;
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
