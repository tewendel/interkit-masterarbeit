<script>

  import { onMount, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { InterkitClient } from "../"

  export let keyColumn;  
  export let key;

  let elementsStore;
  let singleElementStore = writable(null)

  onMount(async () => {
    elementsStore = await InterkitClient.getRowSubStore(keyColumn, { keyColumn })  
    elementsStore.subscribe(data => {
      singleElementStore.set(data.filter(d => d.keyColumn == key)?.[0]?.row)
    })
  });

  setContext("buttonBar", {
    buttonPayload: singleElementStore
  })

</script>

<slot/>