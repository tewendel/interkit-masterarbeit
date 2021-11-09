import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows } from '../imports/collections.js';

Meteor.publish('projects', function() {
  //console.log("projects sub")
  let projects = Projects.find({});
  //console.log(projects.fetch())
  return projects;
});

// get all the sheets in a project
const getSheets = ({projectId}) => {
  if(projectId)
    return Sheets.find({projectId})
  else 
    return null;
}
Meteor.publish('sheets', getSheets);
Meteor.methods({'sheets.get': ({projectId})=>{
  console.log("sheets.get", projectId); 
  let sheets = getSheets({projectId});
  return sheets.fetch();
}});

// get a specific sheet
Meteor.methods({'sheet.get': ({key, projectId})=>{
  let sheet = Sheets.findOne({key, projectId})
  return sheet;
}});

const getRows = ({sheetKey, projectId}) => {
  if(sheetKey && projectId)
    return Rows.find({sheetKey, projectId})
  else 
    return null;
}

Meteor.publish('rows', getRows)

Meteor.methods({'rows.get': ({sheetKey, projectId})=>{
  let rows = getRows({sheetKey, projectId})
  if(rows)
    return rows.fetch();
}})

const getRow = ({key, projectId}) => {
  if(key && projectId)
    return Rows.findOne({key, projectId})
  else 
    return null;
}

Meteor.methods({'row.get': ({key, projectId})=>{
  let row = getRow({key, projectId})
  return row;
}})

Meteor.publish("projectUsers", ({projectId}) => {
  const cursor = Meteor.users.find({ [`projectUserData.${projectId}`] : { $exists:true }}, { fields: { services: false } });
  console.log("publish projectUsers", projectId, cursor.count())
  return cursor
});

Meteor.publish("user.projectUserData", ({ projectId }) => {
  const cursor = Meteor.users.find(Meteor.userId(), { fields: { [`projectUserData.${projectId}`]: true } });
  console.log("user.projectUserData", projectId, cursor.count())
  return cursor
});