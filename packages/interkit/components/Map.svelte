<script>

  import { onMount } from 'svelte'

  import { InterkitClient } from 'interkit'

  export let markerPositions; // type sheetColumn: "sheetId/columnId"
  export let markerLabels; // type sheetColumn: "sheetId/columnId"

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export let activeTab
  
  let latlng = {lat: 51.505, lng: -0.09};

  let map;
  let markers = [];

  let subHandle;

  onMount(async ()=>{
    L.Icon.Default.imagePath = '/leaflet/'

    map = L.map('mapid').setView([latlng.lat, latlng.lng], 13);  

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
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
          title: r.value[labelColumnKey]                    
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
            markers.push(marker);  
          }
        }

        // just for demo purposes, this needs to be much more efficient        
      })
    }


  })

  $: {
    //console.log(activeTab)
    if(activeTab == "Map" && map) {
      setTimeout(()=>{
        map.invalidateSize()  
      }, 100);
    }
  }

</script>

<div id="mapid"></div>
    
<style>
  #mapid { 
    height: 100vh; 
    width: 100%;
  }
</style>
