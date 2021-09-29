<script>
  import { registerAction, InterkitClient } from '../'

  export let uiKey
  export let value

  InterkitClient.getUiKeyStore(uiKey).subscribe(v => {

    InterkitClient.setUiKey(uiKey, v)
  })
  
</script>

