import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages, Channels } from '../imports/collections.js';

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

Meteor.publish("channels", ({projectId}) => {
  let query = {projectId};
  console.log("channels sub with query", query);
  let channels = Channels.find(query, {sort: {createdAt: -1}});
  //console.log(channels.fetch());
  return channels;
});

Meteor.publish("messages", ({projectId, channel_key, origin, userId, limit}) => {
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
  
  let options = {
    sort: {createdAt: -1}
  }

  if(limit) {
    options.limit = limit;
  }
  
  console.log("message sub with", query, options)

  let messages = Messages.find(query, options);
  return messages;
});

Meteor.publish("messages.last", ({projectId, channel_key}) => {
  let query = {
    projectId,
    channel_key
  }
  let options = {
    sort: {createdAt: -1},
    limit: 1
  }

  //console.log("messages.last", query, options)

  let messages = Messages.find(query, options);

  //console.log(messages.fetch())

  return messages;
});

Meteor.publish("messages.unseen", ({projectId, channel_key, userId}) => {
  let query = {
    projectId,
    channel_key,
    seen: {"$nin": [userId]}
  }
  let options = {
    sort: {createdAt: -1},
  }
  let messages = Messages.find(query, options);
  console.log(messages.fetch())
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
