<script context="module">
  export const MAP = {}; // context identifier
</script>

<script>

  import { onMount, setContext, onDestroy } from 'svelte'
  
  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'

  import MapFilterControls from './MapFilterControls.svelte'
  import MapLayerControls from './MapLayerControls.svelte'

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  //import 'leaflet.tilelayer.colorfilter';
  import 'leaflet.tilelayer.gl';
  import { desaturateShader } from './mapShaders.js'

  import { Plugins } from '@capacitor/core';
  const { Geolocation } = Plugins;

  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerIconAsset; // path to asset we use for marker icon
  export let defaultLocation; // where to center the map [lat, lng]

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

  let subHandle;
  let markerRows;

  // store of projectid
  let projectId = InterkitClient.projectId;

  
  // context for MapCategoryFilter components to register themselves
  setContext(MAP, {
    registerFilter: async ({name, categoryNameColumn, categoryColorColumn, categoryUnlistedColumn, elementRefColumn}) => {

      //console.log("registerFilter", name, categoryNameColumn, elementRefColumn, categoryColorColumn)

      // get the sheetId of the sheet with the categories
      let filterCategorySheetKey = util.getSheetKey(categoryNameColumn);
      
      // get the categories that we can filter for with this filter
      let categoryRows = await InterkitClient.call("rows.get", {sheetKey: filterCategorySheetKey})

      let categoryRowsListed = categoryRows.filter(r => !util.rowVal(r, categoryUnlistedColumn))

      // add the filter to our collection
      filterLists.push({
        name,
        filterCategorySheetKey,
        categoryRows: categoryRowsListed,
        categoryNameColumn,
        categoryColorColumn,
        elementRefColumn 
      })

      filterLists = filterLists;
      //console.log(filterLists);
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
      subHandle = await InterkitClient.getSub('rows', 'rows', {sheetKey});
      let rows = subHandle.data;
      rows.subscribe((rowsArray)=>{
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

  const panToUserPosition = () => {
    if(currentPosition)
      map.panTo(currentPosition)
    else 
      console.log("currentPosition", currentPosition)
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

  <MapFilterControls
    {filterLists}
    {setFilter}
    {activeFilter}
  />

  <MapLayerControls
    {layers}
    {setLayer}
    {activeLayer}
  />

  <div 
    on:click={panToUserPosition} id="locateButton"
    style='background-image: url("leaflet/locate.svg")'
  >
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
    width: 40px;
    height: 40px;
    /*background-color: #fff;*/
    position: absolute;
    right: 7px;
    bottom: 85px;
    z-index: 1000;
    border-radius: 2px;
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
</style>
