import { getDistance } from 'geolib';

const colKey = (sheetColumn) => {
    return sheetColumn?.split("/")?.[1]
}

const rowVal = (row, sheetColumn) => {
    return row?.values[colKey(sheetColumn)]
}

export default {

  colKey,
  rowVal,

  rowValString: (row, sheetColumn) => {
    let v = rowVal(row, sheetColumn);
    let r = v ? v : "";
    //console.log("rowValString", v, r)
    return r;
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
  },

  getCategoryIndex: (sectionRow, sectionColumns) => {
    let categoryIndex;
    if(rowVal(sectionRow, sectionColumns.categoryRefsColumn[0])) {
      categoryIndex = 0;
    }
    if(rowVal(sectionRow, sectionColumns.categoryRefsColumn[1])) {
      categoryIndex = 1;
    }
    if(categoryIndex == undefined) {
      console.log("warning: no category selected for slider")
    }
    return categoryIndex;
  },

  getDistance: (elementPosition, userPosition) => {
    if(elementPosition && userPosition) {
      //console.log("getDistance", elementPosition, userPosition)
      let meters = getDistance({
        longitude: userPosition.lng,
        latitude: userPosition.lat
      }, {
        longitude: elementPosition.lng,
        latitude: elementPosition.lat
      })
      //console.log("meters", meters)
      return meters;
    }
  }
}