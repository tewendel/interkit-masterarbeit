<script>
  import { InterkitClient } from '../'
  export let uiKey = "showIf"
  export let storeType = "uiKey"

  let value = null

  if(storeType == "uiKey") {
    InterkitClient.getUiKeyStore(uiKey).subscribe(v => {
      //console.log("change showIf store", uiKey, v)
      value = v
    })
  }

  if(storeType == "globalStore") {
    InterkitClient.getGlobalStore(uiKey).subscribe(v => {
      //console.log("change showIf store", uiKey, v)
      value = v
    }) 
  }

</script>

<!-- showIf {uiKey} value: {value} -->
{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}