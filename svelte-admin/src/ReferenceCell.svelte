<script>

  export let refData
  export let value
  //$: { console.log("ReferenceCell", value, refData) }

  let result;
  $: {
    if(value?.rowIds.length) {
      result = value.rowIds.map(id=>{
        return refData[value.sheetId]?.find(row=>row.id == id)?.value[value.columnKey]
      }).join(", ")
    } else {
      result = "";
    }
    //console.log(result)
  }
  
</script>

{result}

