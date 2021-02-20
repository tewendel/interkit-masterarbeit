<script>

  import { onMount } from 'svelte'

  import { InterkitClient } from 'interkit-shared'

  import config from './Map.yml';

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

    let sheedId = config?.sheetId?.value;
    let columnKey = config?.columnKey?.value;
    console.log(sheedId, columnKey)
    if(sheedId) {
      subHandle = await InterkitClient.getSub('rows', 'rows', [sheedId]);
      let rows = subHandle.data;
      rows.subscribe((rowsArray)=>{
        let locations = rowsArray.map(r=>r.value[columnKey])
        console.log(locations);  

        // clear old markers
        for(let marker of markers) {
          map.removeLayer(marker)
        }
        markers = [];

        // setup new markers
        for(let markerLocation of locations) {
          console.log(markerLocation)
          let marker = L.marker(markerLocation).addTo(map)
          markers.push(marker);  
        }

        // just for demo purposes, this needs to be much more efficient        
      })
    }


  })

  $: {
    console.log(activeTab)
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
