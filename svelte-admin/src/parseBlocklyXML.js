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
    value: f.getAttribute("value"), 
    text: f.getAttribute("text"),
    colType: f.getAttribute("columnType"),
    fieldType: f.getAttribute("fieldType"),
    refKey: f.getAttribute("refKey"),
    options: f.getAttribute("options")
  }})
  for(let ref of refs) {

    let sheetKey;
    let columnKey;
    let sheetName;
    let columnName;

    if(ref.fieldType == "sheetId") {
      sheetKey = ref.value;
      sheetName = ref.text;
    }

    if(ref.fieldType == "sheetColumn") {
      sheetKey = ref.value.split("/")[0]
      columnKey = ref.value.split("/")[1]
      sheetName = ref.text.split("/")[0]
      columnName = ref.text.split("/")[1]
    }

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
              await InterkitClient.call("sheet.addColumn", {
                projectId, 
                sheetKey, 
                colKey: columnKey, 
                name: columnName, 
                type: ref.colType, 
                reference: ref.refKey,
                options: ref.options
              })

              if(ref.colType == "sheetRef")  {
                console.log(ref);
                let refSheet = await InterkitClient.call("sheet.get", {key: ref.refKey, projectId});
                if(!refSheet) {
                  if(confirm(`create sheet ${ref.refKey} referenced in column ${columnName}?`)) {
                    await InterkitClient.call("sheet.create", {projectId, sheetKey: ref.refKey, name: ref.refKey}) 
                  }
                }
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