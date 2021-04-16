<script>

  export let refData
  export let value
  //$: { console.log("ReferenceCell", value, refData) }

  let result;
  $: {
    if(value?.rowKeys.length) {
      result = value.rowKeys.map(key=>{
        return refData[value.sheetKey]?.find(row=>row.key == key)?.values[value.columnKey]
      }).join(", ")
    } else {
      result = "";
    }
    //console.log(result)
  }
  
</script>

{result}

