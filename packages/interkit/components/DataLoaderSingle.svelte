<script>

  import { InterkitClient } from '../'
  import { onMount, setContext } from "svelte";
  import { writable } from 'svelte/store';

  export let sheetKey;
  export let rowKey;

  let rows; // row sub store for the whole sheet
  const rowStore = writable(null) // store to hold just the data for the row we want
  setContext("element", rowStore) // put that store in an element context

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [{key: "1", values: {}}]
  
  // subscribe to the rows in that sheet
  onMount(async () => {
    rows = await InterkitClient.getRowSubStore(sheetKey)  
  })

  // find the right row and update the store
  const updateContent = async (rows) => {
    console.log("updateContent DataLoaderSingle", rows)
    let row;
    if(rows) {
      row = rows.find(r => r.key == rowKey);
    }
    if($showDummyData) {
      rowStore.set(dummyData)
    } else {
      rowStore.set(row);
    }
  }

  // update the store when data changes
  $: {
    updateContent($rows)
  }

</script>

<slot/>