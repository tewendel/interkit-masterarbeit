<script>
  import { InterkitClient } from '../'

  export let globalStore
  let elementDetail = globalStore ? InterkitClient.getGlobalStore(globalStore) : null;

  console.log("ElementProvider providing", $elementDetail)
</script>

<slot name="consumer" element={elementDetail ? $elementDetail : undefined}/>
