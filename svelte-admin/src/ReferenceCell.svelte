<script>

  export let refData
  export let value

  let result;
  $: {
    result = refData[value.sheetId]?.find(r=>r.id == value.rowId)?.value[value.columnKey]
    if(!result) result = ""
  }
  
</script>

{result}

