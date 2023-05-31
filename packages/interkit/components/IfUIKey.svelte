<script>
  import { InterkitClient } from '../'
  
  export let storeType = "uiKey"
  export let key;
  export let value;
  
  let currentValue = undefined

  if(key && storeType == "UIKey") {
    InterkitClient.getUiKeyStore(key).subscribe(v => {
      //console.log("change showIf store", uiKey, v)
      currentValue = v
    })
  }

  if(key && storeType == "globalStore") {
    InterkitClient.getGlobalStore(key).subscribe(v => {
      //console.log("change showIf store", uiKey, v)
      currentValue = v
    }) 
  }

</script>

<!-- showIf {uiKey} value: {value} -->
{#if currentValue == value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}