import { Projects, Sheets, Rows } from '../imports/collections.js';

Meteor.publish('projects', function() {
  return Projects.find({});
});

Meteor.publish('sheets', function(projectId) {
  if(projectId)
    return Sheets.find({projectId})
  else 
    return null;
})

Meteor.publish('rows', function(sheetId) {
  if(sheetId)
    return Rows.find({sheetId})
  else 
    return null;
})