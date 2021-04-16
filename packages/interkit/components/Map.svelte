<script context="module">
  export const MAP = {}; // context identifier
</script>

<script>

  import { onMount, setContext } from 'svelte'
  
  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'

  import MapFilterControls from './MapFilterControls.svelte'
  
  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerLabels; // type sheetColumn: "sheetId/columnId"
  export let audioColumn; // type sheetColumn: "sheetId/columnId"

  let filterLists = [];
  let activeFilter;

  let projectId = INTERKIT_PROJECT_ID;
  
  // context for MapCategoryFilter components to register themselves
  setContext(MAP, {
    registerFilter: async (name, categoryNameColumn, elementRefColumn) => {
      // get the sheetId of the sheet with the categories
      let filterCategorySheetKey = util.getSheetKey(categoryNameColumn);
      
      // get the categories that we can filter for with this filter
      let categoryRows = await InterkitClient.call("rows.get", {sheetKey: filterCategorySheetKey, projectId})

      // add the filter to our collection
      filterLists.push({
        name,
        filterCategorySheetKey,
        categoryRows,
        categoryNameColumn,
        elementRefColumn 
      })
    }
  });

  //console.log(markerPositions, markerLabels)

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let latlng = {lat: 51.505, lng: -0.09};

  let map;
  let mapElement; 
  let markers = [];

  let subHandle;
  let markerRows;

  const markerClick = async (e) => {
    console.log("marker clicked", e.target?.payload);
    await playAudio(
      e.target?.payload?.audio,
      e.target?.payload?.title, 
      false
    )
  }

  const updateMarkers = () => {

    //console.log("activeFilter", activeFilter, markerRows);

    // filter rows
    let rowsFiltered = markerRows.filter(r => 
      !activeFilter ||
      util.rowVal(r, activeFilter.elementRefColumn)?.rowKeys?.includes(activeFilter.row.key)
    )

    // prepare data for marker production
    let markerValues = rowsFiltered.map(r=> {return {
      location: (util.rowVal(r, markerPositions)?.lat
                && util.rowVal(r, markerPositions)?.lng ?
                util.rowVal(r, markerPositions) : undefined),
      title: util.rowVal(r, markerLabels),
      audio: util.rowVal(r, audioColumn)?.value
    }})

    // clear old markers
    for(let marker of markers) {
      map.removeLayer(marker)
    }
    markers = [];

    // setup new markers
    for(let markerValue of markerValues) {
      if(markerValue.location) {
        let marker = L.marker(markerValue.location, {title: markerValue.title}).addTo(map)
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

    map = L.map('mapid', {zoomControl: false}).setView([latlng.lat, latlng.lng], 13);  

    // these tiles fail to load on ios - not sure why
    /*L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);*/

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    let sheetKey;
    if(markerPositions) {
      sheetKey = util.getSheetKey(markerPositions)
    }
    
    //console.log(sheetId, positionColumnKey, labelColumnKey)
    if(sheetKey) {
      subHandle = await InterkitClient.getSub('rows', 'rows', [{sheetKey, projectId}]);
      let rows = subHandle.data;
      rows.subscribe((rowsArray)=>{
        markerRows = rowsArray;
        updateMarkers();
      })
    }

  })

  const setFilter = (filter) => {
    activeFilter = filter;
    updateMarkers();
  }
   
</script>

<slot name="filters"></slot>
<slot name="layers"></slot>

<div id="mapid" bind:this={mapElement}></div>

<MapFilterControls
  {filterLists}
  {setFilter}
  {activeFilter}
/>

<style>
  #mapid { 
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
  }
</style>
