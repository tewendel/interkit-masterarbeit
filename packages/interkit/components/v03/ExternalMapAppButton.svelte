<script>
import { InterkitClient, util } from '../'
import Button from './Button.svelte'
import Icon from './Icon.svelte'
import { Capacitor } from '@capacitor/core';

export let label = "Open Map App"
export let locationColumn;
export let secondaryPositionProperty; // an optional elementProperty that gives an element a user specific position

const elementProperties = InterkitClient.getGlobalStore("elementProperties")

const openExternalMap = (arg) => {

  let coords = arg?.values[util.colKey(locationColumn)]
  if(secondaryPositionProperty && $elementProperties?.[arg?.key]?.[secondaryPositionProperty]) {
    coords = $elementProperties?.[arg?.key]?.[secondaryPositionProperty] 
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


<Button type="secondary" onClick={openExternalMap}>
  <Icon type="Thin-Location" />
  <span>{label}</span>
</Button>
