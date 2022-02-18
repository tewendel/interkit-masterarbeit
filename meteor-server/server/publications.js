import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages } from '../imports/collections.js';

Meteor.publish('projects', function() {
  //console.log("projects sub")
  let projects = Projects.find({});
  //console.log(projects.fetch())
  return projects;
});

Meteor.publish('project', function(projectId) {
  //console.log("project sub")
  let projects = Projects.find({_id: projectId});
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

Meteor.publish("user", ({ projectId }) => {
  const cursor = Meteor.users.find(Meteor.userId());
  return cursor
});

Meteor.publish("messages", ({projectId, channel_key, origin, userId}) => {
  let query = {projectId};
  if (channel_key) {
    query.channel_key = channel_key;
  }
  if (userId) {
    query.$or = [
      {sender: userId}, 
      {recipients: userId} 
    ]
  }
  if (origin) {
    query.origin = origin;
  }
  console.log(query)
  let messages = Messages.find(query, {sort: {createdAt: -1}});
  return messages;
});

Meteor.publish("messages.unhandled", ({projectId}) => {
  let query = {
    projectId,
    handledAt: { $exists: false },
    origin: { $not: { $in: ["handler"] } }
  }
  let messages = Messages.find(query, {sort: {createdAt: -1}});
  // console.log("messages.unhandled count: " + messages.count(), messages.fetch())
  return messages;
});
