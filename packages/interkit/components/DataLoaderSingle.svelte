<script>

  import { InterkitClient } from '../'
  import { onMount, setContext } from "svelte";
  import { writable } from 'svelte/store';

  export let sheetKey;
  export let rowKey;

  const rowStore = writable(null)
  setContext("element", rowStore)
  
  onMount(async ()=>{
    let row = await InterkitClient.call("row.get", {key: rowKey});
    console.log("DataLoaderSingle", row)
    rowStore.set(row)
  })

</script>

<slot/>