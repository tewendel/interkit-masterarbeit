const colKey = (sheetColumn) => {
    return sheetColumn?.split("/")?.[1]
}

export default {

  colKey,

  rowVal: (row, sheetColumn) => {
    return row?.values[colKey(sheetColumn)]
  },

  getSheetKey: (sheetColumn) => {
    return sheetColumn?.split("/")?.[0];
  },

  getSheetId: (sheetColumn) => {
    alert("deprecated use of getSheetId")
    return sheetColumn?.split("/")?.[0];
  },

  // finds the column key of the first text column in a sheet
  firstTextColKey: (sheet) => {
    //console.log(sheet)
    let textColumn = sheet.columns.find(c => c.type == "string")
    //console.log(textColumn)
    return textColumn?.key;
  }
  








}