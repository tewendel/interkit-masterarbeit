import { InterkitClient } from 'interkit'

const verifyValue = (v) => {
  return v && v !== "undefined" && v !== "null" && v !== ""
}

const parseBlocklyXML = async (xml, projectId) => {

  let prompted = false;
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(xml, "text/xml");
  let fields = Array.from(xmlDoc.getElementsByTagName("field"))
  let refs = fields.map(f=>{return {
    field: f.getAttribute("value"), 
    text: f.getAttribute("text"),
    colType: f.getAttribute("fieldType")
  }})
  for(let ref of refs) {
    if(ref.field && ref.text) {
      let sheetKey = ref.field.split("/")[0]
      let columnKey = ref.field.split("/")[1]
      let sheetName = ref.text.split("/")[0]
      let columnName = ref.text.split("/")[1]
      
      // check if sheet exists
      if(verifyValue(sheetKey)) {

        let sheet = await InterkitClient.call("sheet.get", {key: sheetKey, projectId});
        if(!sheet) {
          prompted = true;

          if(confirm("create sheet " + sheetName + " (" + sheetKey + ") ?")) {
            await InterkitClient.call("sheet.create", {projectId, sheetKey, name: sheetName})

            sheet = await InterkitClient.call("sheet.get", {key: sheetKey, projectId});
          }
        } else {
          console.log("sheet exists", sheetKey, sheetName)
        }

        if(sheet) {
          console.log("checking column ", columnKey, columnName)

          if(verifyValue(columnKey)) {

            if(sheet.columns.find(c => c.key == columnKey)) {
              console.log("column exists", columnKey, columnName)            
            } else {

              prompted = true;
              if(confirm("create column " + columnName + " (" + columnKey + ") type "+ ref.colType +"?")) {
                await InterkitClient.call("sheet.addColumn", {projectId, sheetKey, colKey: columnKey, name: columnName, type: ref.colType})
              }
            }
          }
        }
      }
    }
  }
  alert("check completed." + (!prompted ? " looks good!" : ""));
}

export default parseBlocklyXML;