import { Projects, Sheets, Rows } from '../imports/collections.js';

Meteor.publish('projects', function() {
  return Projects.find({});
});

const getSheets = (projectId) => {
  if(projectId)
    return Sheets.find({projectId})
  else 
    return null;
}
Meteor.publish('sheets', getSheets);

Meteor.methods({'sheets.get': (projectId)=>{
  //console.log("sheets.get"); 
  let sheets = getSheets(projectId);
  return sheets.fetch();
}});

Meteor.methods({'sheet.get': (sheetId)=>{
  //console.log("sheet.get"); 
  let sheet = Sheets.findOne(sheetId)
  return sheet;
}});

const getRows = (sheetId) => {
  if(sheetId)
    return Rows.find({sheetId})
  else 
    return null;
}

Meteor.publish('rows', getRows)

Meteor.methods({'rows.get': (sheetId)=>{
  let rows = getRows(sheetId)
  return rows.fetch();
}})