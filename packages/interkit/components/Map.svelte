<script>

  import { onMount } from 'svelte'

  import { InterkitClient, util } from '../'
  import { playAudio } from './AudioPlayer.svelte'
  
  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerLabels; // type sheetColumn: "sheetId/columnId"
  export let audioColumn; // type sheetColumn: "sheetId/columnId"

  

  //console.log(markerPositions, markerLabels)

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let latlng = {lat: 51.505, lng: -0.09};

  let map;
  let mapElement; 
  let markers = [];

  let subHandle;

  const markerClick = async (e) => {
    console.log("marker clicked", e.target?.payload);
    await playAudio(e.target?.payload?.audio, e.target?.payload?.title, false)
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
  
    let sheetId;
    let positionColumnKey;
    if(markerPositions) {
      sheetId = markerPositions.split("/")?.[0]
      positionColumnKey = markerPositions.split("/")?.[1]
    }
    let labelColumnKey;
    if(markerLabels) {
      let sheetIdLabels = markerLabels.split("/")?.[0]
      if(sheetId != sheetIdLabels) {
        alert("marker positions and labels must be on the same sheet")
      }
      labelColumnKey = markerLabels.split("/")?.[1]
    }
    
    //console.log(sheetId, positionColumnKey, labelColumnKey)
    if(sheetId) {
      subHandle = await InterkitClient.getSub('rows', 'rows', [sheetId]);
      let rows = subHandle.data;
      rows.subscribe((rowsArray)=>{
        
        let markerValues = rowsArray.map(r=> {return {
          location: (r.value[positionColumnKey]?.lat && r.value[positionColumnKey]?.lng) ?
            r.value[positionColumnKey] : undefined,
          title: r.value[labelColumnKey],                    
          audio: r.value[util.colKey(audioColumn)]?.value
        }})

        //console.log(markerValues);

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

        // just for demo purposes, this needs to be much more efficient        
      })
    }

  })
   
</script>

<div id="mapid" bind:this={mapElement}></div>
    
<style>
  #mapid { 
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
  }
</style>
