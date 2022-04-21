import { getDistance } from 'geolib';
import { getContext } from 'svelte';
import { get } from 'svelte/store';

const colKey = (sheetColumn) => {
    return sheetColumn?.split("/")?.[1]
}

const rowVal = (row, sheetColumn) => {
    return row?.values[colKey(sheetColumn)]
}

/* utility function to convert a sheet row into a more conveniently accessible object 
 row = {
    "name": "anna"
 }
 columnMap = {
    "elements/name": "name"
 }
 object = {
    "name": "anna"
 }
*/

const rowToObject = (row, columnMap) => {
  let object = {};
  object.key = row.key; // preserve the row key
  object.row = row // preserve the original row
  for(let key in columnMap) {
    object[key] = rowVal(row, columnMap[key])
  }
  //console.log("rowToObject", row, columnMap, object)
  return object
};


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
  
  rowToObject,
  rowsToObjects: (rows, columnMap) => {
    if(!columnMap) return [];
    if(Array.isArray(rows))
      return rows.map((r)=>{return rowToObject(r, columnMap)})
    if(typeof data == "object")
      return rowToObject(rows, columnMap)
    console.log("rowsToObjects conversion error");
    return [];
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
  },

  formatDuration: (milliseconds) => {
    if (isNaN(milliseconds)) return '';
    let seconds = Math.floor(milliseconds / 1000);
    //console.log("formatDuration", seconds);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;
    return `${minutes}:${seconds}`;
  },

  filterColorRGB: (categoryRow, categoryColorColumn) => {
    let value = rowVal(categoryRow, categoryColorColumn);
    if(value) {
      try {
        let rgbArray = JSON.parse(value)
        const c = (index) => Math.floor(rgbArray[index] * 256)
        return `rgb(${c(0)},${c(1)},${c(2)})`
      } catch(e) {
        console.log(e)
      }
    } else {
      return ""
    }
  },

  formatDistance: (meters) => {
    let d = "";
    if(meters < 1000) d = meters + "m";
    else d = Math.floor(meters / 1000) + "km";
    return d;
  },

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  extractContextProp(propValue) {

    if(propValue.includes("$ElementProvider")) { // only implemented for ElementProvider for now
      console.log("getting channel_key from context...")
      const parts = propValue.split(".");
      const attributeName = parts[1]; 

      let context = getContext("ElementProvider");
      let element = get(context?.element); // we assume for now this is always a store containing a row
      let extractedValue = element?.values?.[attributeName];
      console.log("retrieved", extractedValue)
      return extractedValue
    } else {
      return propValue
    }

  }

}