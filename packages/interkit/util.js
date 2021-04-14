const colKey = (sheetColumn) => {
    return sheetColumn?.split("/")?.[1]
}

export default {

  colKey,

  rowVal: (row, sheetColumn) => {
    return row?.value[colKey(sheetColumn)]
  },

  // finds the column key of the first text column in a sheet
  firstTextColKey: (sheet) => {
    //console.log(sheet)
    let textColumn = sheet.columns.find(c => c.type == "string")
    //console.log(textColumn)
    return textColumn?.key;
  }
  








}