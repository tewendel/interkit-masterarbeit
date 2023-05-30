<script>

  import { InterkitClient, util } from '../'
  import { onMount, setContext } from "svelte";
  import { writable } from 'svelte/store';

  export let sheet;
  export let rowKey; 
  export let customKeyColumn = null; // a column that we can optionally use as key to find the row

  let rows; // row sub store for the whole sheet
  const rowStore = writable(null) // store to hold just the data for the row we want
  setContext("element", rowStore) // put that store in an element context

  const showDummyData = InterkitClient.showDummyData;
  const dummyData = [{key: "1", values: {}}]
  
  // subscribe to the rows in that sheet
  onMount(async () => {
    if (sheet) {
      rows = await InterkitClient.getRowSubStore(sheet)  
    }
  })

  // find the right row and update the store
  const updateContent = async (rows) => {
    let row;
    if(rows) {
      console.log("DataLoaderSingle finding row", customKeyColumn, rowKey, rows)
      // if customKeyColumn is set, we use that to find the row, otherwise the row key
      row = rows.find(r => rowKey == (customKeyColumn ? util.rowVal(r, customKeyColumn) : r.key));
      console.log("DataLoaderSingle found row", row, util.rowVal(rows[0], customKeyColumn))
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