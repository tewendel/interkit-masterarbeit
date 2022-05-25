<script>
import util from '../util'
import Button from './Button.svelte'
import Icon from './Icon.svelte'
import { Capacitor } from '@capacitor/core';

export let label = "Open Map App"
export let locationColumn;

const openExternalMap = (arg) => {
  let coords = arg?.values[util.colKey(locationColumn)]

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
