<script context="module">
  export const MAP = {}; // context identifier
</script>

<script>

  import { onMount, setContext, onDestroy } from 'svelte'
  import { get } from 'svelte/store'
  
  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  import MapFilterControls from './MapFilterControls.svelte'
  import MapLayerControls from './MapLayerControls.svelte'

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  //import 'leaflet.tilelayer.colorfilter';
  import 'leaflet.tilelayer.gl';
  import { desaturateShader } from './mapShaders.js'

  import { Plugins } from '@capacitor/core';
  const { Geolocation, Permissions } = Plugins;

  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerIconAsset; // path to asset we use for marker icon
  export let defaultLocation; // where to center the map [lat, lng]
  // what to tell the user when there is no permission for gps
  export let permissionNotification = "Die App hat keine Erlaubnis, ihre Position festzustellen. Unter Start > Einstellungen > FAQ finden Sie eine Anleitung, um die Erlaubnis für Ihr Gerät zu erteilen."; 

  let defaultLocationLatLng = [51.505, -0.09];
  if(defaultLocation) {
    try {
      defaultLocationLatLng = JSON.parse(defaultLocation)
      //console.log("defaultLocationLatLng", defaultLocationLatLng)
    } catch(e) {
      console.log("error parsinng defaultLocation")
    }
  }
  
  let filterLists = [];
  let activeFilter;

  let layers = [];
  let activeLayer;
  let imageOverlay;
  
  let map;
  let labels_layer; // layer for street names
  let mapElement; 
  let markerIcon;
  let userIcon;
  let userPositionMarker;
  let markers = [];
  let satLayer; // this is a special webgl layer to color satellite tiles
  let geoWatch;
  let currentPosition;

  let selectedElement;

  let elementRows; // store with the elements we want to show
  let unsubElementRows; // unsubscribe method to this store
  let markerRows;

  // store of projectid
  let projectId = InterkitClient.projectId;

  
  // context for MapCategoryFilter components to register themselves
  setContext(MAP, {
    registerFilter: async ({name, categoryNameColumn, categoryColorColumn, categoryUnlistedColumn, elementRefColumn}) => {

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
        elementRefColumn 
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

  //console.log(markerPositions, markerLabels)

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

  const updateMarkers = () => {

    //console.log("activeFilter", activeFilter, markerRows);

    // filter rows
    let rowsFiltered = markerRows.filter(r => 
      !activeFilter ||
      util.rowVal(r, activeFilter.elementRefColumn)?.rowKeys?.includes(activeFilter.row.key)
    )

    // prepare data for marker production and audio playback when clicked
    let markerValues = rowsFiltered.map(r=> {return {
      location: (util.rowVal(r, markerPositions)?.lat
                && util.rowVal(r, markerPositions)?.lng ?
                util.rowVal(r, markerPositions) : undefined),
      elementRow: r
    }})

    // clear old markers
    for(let marker of markers) {
      map.removeLayer(marker)
    }
    markers = [];

    // setup new markers
    for(let markerValue of markerValues) {
      if(markerValue.location) {
        let markerOptions = {
          title: markerValue.title,
        }
        if(markerIcon) {
          markerOptions.icon = markerIcon;
        }
        //console.log(markerOptions)
        let marker = L.marker(markerValue.location, markerOptions).addTo(map)
        marker.payload = markerValue;
        marker.on('click', markerClick);
        markers.push(marker);  
      }
    }
    // this probably needs to be much more efficient
  }

  onMount(async ()=>{
    //console.log("onMount map")

    L.Icon.Default.imagePath = '/leaflet/'

    //console.log("defaultLocationLatLng", defaultLocationLatLng)

    map = L.map('mapid', {
      zoomControl: false,
      attributionControl: false,
    }).setView(defaultLocationLatLng, 13);  

    // these tiles fail to load on ios - not sure why
    /*L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);*/

    map.on("click", mapClick);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    let esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    let esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

    // Instantiate our L.TileLayer.GL...
    satLayer = L.tileLayer.gl({
      uniforms: {
        uRGB: [1.0, 1.0, 1.0]
      },
      fragmentShader: desaturateShader,
      tileUrls: [esriUrl],
      //attribution: esriAttr
    }).addTo(map);

    let cartodbAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    let cartodbUrl = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'

    labels_layer = L.tileLayer(cartodbUrl, {
      id: 'cartodb_labels', 
      //attribution: cartodbAttr
    }).addTo(map)

    // load the marker icon
    if(markerIconAsset) {
      markerIcon = L.icon({
        iconUrl: markerIconAsset,
        iconSize:     [24, 24], // size of the icon
        iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
      });
      //console.log(markerIcon)
    }

  
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

    //const coordinates = await Geolocation.getCurrentPosition();
    //console.log('Current Position', coordinates);
    let lastErrorCode;

    geoWatch = Geolocation.watchPosition({}, (position, err) => {
      if(position) {
        currentPosition = {lat: position.coords.latitude, lng: position.coords.longitude}
        //console.log(position, err)

        let positionStore = InterkitClient.getGlobalStore("userPosition")
        positionStore.set(currentPosition);

        if(!userIcon)
          userIcon = L.icon({
            iconUrl: "leaflet/user_pos.svg",
            iconSize:     [12, 12], 
            iconAnchor:   [6, 6], 
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
    activeFilter = filter;
    updateMarkers();

    let colorRGBArray;
    if(filter) {
      let colorRGB = util.rowVal(filter.row, filter.categoryColorColumn);
      try {
        colorRGBArray = JSON.parse(colorRGB)
      } catch(e) {
        console.info("error parsing colorRGBArray")
      }
    }
    
    // update colorization 
    if(filter && colorRGBArray) {
      satLayer.setUniform("uRGB", colorRGBArray);
      satLayer.reRender();
    } else {
      satLayer.setUniform("uRGB", [1.0, 1.0, 1.0]);
      satLayer.reRender();
    }
  }

  // set the image overlay layer
  const setLayer = (layer) => {
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

    } else {
      if(imageOverlay) {
        map.removeLayer(imageOverlay);
      }
      if(!map.hasLayer(labels_layer)) {
          labels_layer.addTo(map);
      }
    }
  }

  const panToUserPosition = async () => {
    let result = await Permissions.query({name: "geolocation"})
    if(result != "granted") {
      alert(permissionNotification)
    } else {
      if(currentPosition)
        map.panTo(currentPosition)
      else 
        console.log("currentPosition", currentPosition)
    }
  }

  const zoomIn = async () => {
    map.zoomIn()
  }

  const zoomOut = async () => {
    map.zoomOut()
  }

</script>

<div class="Map__Container container">
  
  <slot name="filters"></slot>
  <slot name="layers"></slot>

  {#if selectedElement}
    <div class="marker_popup">
      <slot name="element" element={{size: "m", ...selectedElement}}></slot>
    </div>
  {/if}

  <div class="Map__LayerControls layer_controls">
    <MapFilterControls
      {filterLists}
      {setFilter}
      {activeFilter}
    />

    <MapLayerControls
      {layers}
      {setLayer}
      {activeLayer}
      elementRows = {$elementRows}
    />
  </div>

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

  .marker_popup {
    position: absolute;
    bottom: 70px;
    margin-left: 10px;
    margin-right: 10px;
    z-index: 1000;
    background-color: #fff;
  }

  :global(.leaflet-control) { /* hide default leaflet controls */
    display: none;
  }

  .controls {
    position: absolute;
    right: 0;
    bottom: 50%;
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

  .layer_controls {
    position: absolute;
    bottom: 0;
    padding: 20px 55px 55px 55px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    z-index: 1000;
    display: flex;
    place-content: space-between;
  }
</style>
