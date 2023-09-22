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

  import { currentProjectReadOnly } from "../admin";

  export let open = false;
  export let value;
  
  
  let center;
  if(value) {
    center = value // normally center map on marker
  } else { 
    try {
      center = JSON.parse(localStorage.getItem("locationPickerMapPosition"))
    } catch(e) {
      console.log(e)
      center = null;
    }
    console.log(center)
  }
  if(!center) {
    center = {lat: 51.505, lng: -0.09} // default map center
  }

  let zoom;
  zoom = localStorage.getItem("locationPickerMapZoom")
  if(!zoom) {
    zoom = 13;
  }

  export let submit;
  export let close;

  let map;
  let marker;

  const setupMarker = (latLng) => {
    if(marker)
      map.removeLayer(marker);
    marker = L.marker([latLng.lat, latLng.lng], {draggable: true}).addTo(map)
    value = latLng;
    marker.on('dragend', function(event) {
      value = event.target.getLatLng();
      console.log(value.lat, value.lng)
    });
  }

  onMount(()=>{
    L.Icon.Default.imagePath = 'leaflet/'

    map = L.map('mapid').setView([center.lat, center.lng], zoom);  

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('dragend',function(e){
      console.log(map.getCenter())
      localStorage.setItem("locationPickerMapPosition", JSON.stringify(map.getCenter()))
    });

    map.on('zoomend', function() {
      localStorage.setItem("locationPickerMapZoom", map.getZoom())
    });

    map.on('click', function(e) {        
        let clickLocation = e.latlng;
        if(!marker) {
          setupMarker(clickLocation);
        } else {
          value = clickLocation;
          marker.setLatLng(clickLocation); 
        }
    });

    if(value) {
      setupMarker(value);
    }
  
  })

  $: {
    if(value && marker) {
      marker.setLatLng(value)
      map.setView(value)
    }
  }

  let geocodingQuery = null;
  const doGeocoding = async () => {
    if(geocodingQuery?.length) {
      console.log(geocodingQuery)
      let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${geocodingQuery}&format=json`);
      let responseJSON = await response.json()
      console.log(responseJSON);
      if(responseJSON?.[0])
        map.setView({lat: responseJSON[0].lat, lng: responseJSON[0].lon})
    }
  }

  const onKeyPress = e => {
    if (e.charCode === 13) doGeocoding();
  }

  const moveToMarker = () => {
    if(value) {
      map.setView(value);
    }
    
  }
  
</script>


<ComposedModal open
  on:submit={()=>{open = false; submit()}}
  on:close={close}
  >
  <ModalHeader title="Drag the marker or click on the map to choose a location" />
  <ModalBody>

     <div id="mapid"></div>

     <input type="text" bind:value={geocodingQuery} on:keypress={onKeyPress}/>
     <button on:click={doGeocoding}>move map</button>
     <button on:click={moveToMarker}>back to marker</button>
    
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>


<style>
  #mapid { height: 180px; margin-bottom: 20px;}
</style>