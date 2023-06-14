<script>
import { InterkitClient, util } from '../'
import { getContext } from "svelte"
import Button from './Button.svelte'
import Icon from './Icon.svelte'
import { Capacitor } from '@capacitor/core';

export let label = "Open Map App"
export let type;
export let size;
export let locationColumn;
export let secondaryPositionProperty; // an optional elementProperty that gives an element a user specific position

const elementProperties = InterkitClient.getGlobalStore("elementProperties")

const elementContext = getContext("element")

const openExternalMap = (arg) => {

  let coords = $elementContext?.values[util.colKey(locationColumn)]
  if(secondaryPositionProperty && $elementProperties?.[$elementContext?.key]?.[secondaryPositionProperty]) {
    coords = $elementProperties?.[$elementContext?.key]?.[secondaryPositionProperty] 
    console.log("ExternalMapAppButton - using secondaryPositionProptery")
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


<Button {type} {size} on:click={openExternalMap}>
  <slot name="Icon"></slot>
  <span>{label}</span>
</Button>
