<script>
  import { InterkitClient } from '../'
  export let uiKey = "showIf"

  let value = null

  InterkitClient.getUiKeyStore(uiKey).subscribe(v => {
    console.log("change showIf store", v)
    value = v
  })

</script>

<!-- showIf {uiKey} value: {value} -->
{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}