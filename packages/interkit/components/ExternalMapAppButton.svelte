<script>
import { InterkitClient, util } from '../'
import { getContext } from "svelte"
import Button from './Button.svelte'
import { Capacitor } from '@capacitor/core';

export let buttonOptions;
export let locationColumn;
export let secondaryPositionProperty; // an optional elementProperty that gives an element a user specific position
export let coords; // an optional prop that can be used to override the locationColumn {lat, lng}

const elementProperties = InterkitClient.getGlobalStore("elementProperties")

const elementContext = getContext("element")

const openExternalMap = (arg) => {

  if (!coords) {
    coords = $elementContext?.values[util.colKey(locationColumn)]
    if(secondaryPositionProperty && $elementProperties?.[$elementContext?.key]?.[secondaryPositionProperty]) {
      coords = $elementProperties?.[$elementContext?.key]?.[secondaryPositionProperty] 
      console.log("ExternalMapAppButton - using secondaryPositionProptery")
    }
  }
  let googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${coords.lat}%2C${coords.lng}`
  if(coords) {
    let platform = Capacitor.getPlatform()
    console.log("platform", platform)
    if(platform == "ios") {
      window.open(googleMapsURL);
    } else {
      window.open(googleMapsURL);
    }
  }
}

</script>


<Button {buttonOptions} on:click={openExternalMap} class="ExternalMapAppButton">
  <slot name="Icon"></slot>
</Button>
