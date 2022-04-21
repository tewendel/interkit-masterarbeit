<script>
  import { InterkitClient } from '../'
  import { setContext } from "svelte"

  export let globalStore
  let elementDetail = globalStore ? InterkitClient.getGlobalStore(globalStore) : null;

  console.log("ElementProvider providing", $elementDetail)

  // additionaly provide context
  setContext("ElementProvider", {
    element: elementDetail
  })


</script>

<slot name="consumer" element={elementDetail ? $elementDetail : undefined}/>
