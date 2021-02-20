<script>

import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "carbon-components-svelte";

  import { onMount } from 'svelte'

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export let open = false;
  export let latlng = {lat: 51.505, lng: -0.09};

  export let submit;

  let map;
  let marker;

  onMount(()=>{
    L.Icon.Default.imagePath = 'leaflet/'

    map = L.map('mapid').setView([latlng.lat, latlng.lng], 13);  

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([51.5, -0.09], {draggable: true}).addTo(map)

    marker.on('dragend', function(event) {
      latlng = event.target.getLatLng();
      console.log(latlng.lat, latlng.lng)
    });
  
  })

  $: {
    if(latlng && marker) {
      marker.setLatLng(latlng)
      map.setView(latlng)
    }
  }
  
</script>


<ComposedModal {open}
  on:submit={()=>{open = false; submit()}}
  on:close={()=>open = false}
  >
  <ModalHeader title="Drag the marker to choose a location" />
  <ModalBody>

     <div id="mapid"></div>
    
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>


<style>
  #mapid { height: 180px; }
</style>