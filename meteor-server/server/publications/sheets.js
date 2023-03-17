import { Meteor } from 'meteor/meteor';
import { Sheets } from '../../imports/collections.js';


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
