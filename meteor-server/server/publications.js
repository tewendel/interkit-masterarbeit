import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages, Channels, ScheduledEvents } from '../imports/collections.js';
import {userIsInRoles} from '../imports/userRoles.js';

Meteor.publish('projects', function() {
  let fields = {
    name: 1,
    slug: 1,
    isDefaultProject: 1,
    history : userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    projectServer: {
      status: 1,
      actionRequested: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
      messages: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    },
    uiState: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
  }
  //console.log("projects sub")
  if (userIsInRoles(this.userId, ['admin', 'author', 'bundler'])) {
    let projects = Projects.find({}, { fields});
    //console.log(projects.fetch())
    return projects;
  }
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
  console.log("user.projectUserData", Meteor.userId(), projectId, cursor.count())
  return cursor
});

Meteor.publish("user", ({ projectId }) => {
  const cursor = Meteor.users.find(Meteor.userId());
  return cursor
});

Meteor.publish("user.bundler.status", () => {
  const cursor = Meteor.users.find({ username: 'bundler' }, { fields: { 'status': true, username: true } });
  return cursor
});


Meteor.publish("channels", ({projectId}) => {
  let query = {projectId};
  console.log("channels sub with query", query);
  let channels = Channels.find(query, {sort: {createdAt: -1}});
  //console.log(channels.fetch());
  return channels;
});

Meteor.publish("messages", ({projectId, channel_key, origin, userId, limit, includeBlocked}) => {
  let query = {projectId};
  if (channel_key) {
    query.channel_key = channel_key;
  }

  if (!includeBlocked) {
    query.blocked = { $ne: true }
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

Meteor.publish("messages.last", ({projectId, channel_key, userId, includeBlocked}) => {
  console.log("subscribing to messages.last with", projectId, channel_key, userId, includeBlocked)
  let query = {
    projectId,
    channel_key,
    "payload.type": { $in: ["text", "image", "video", "audio"] },
    $or: [{ sender: userId }, { recipients: userId }]
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
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

// used by raspi script
Meteor.publish(
  "messages.latest.forMe",
  ({ projectId = null } = {}) => {

    const userId = Meteor.userId();

    if (!userId) {
      console.warn(`missing user for publication messages.latest.forMe`);
      return null;
    }

    if (!projectId) {
      console.warn(`missing projectId for publication messages.latest.forMe`);
      return null;
    }

    let query = {
      projectId,
      recipients: userId
    };

    let options = {
      sort: { createdAt: -1 },
      limit: 1,
    };

    let messages = Messages.find(query, options);

    //console.log(messages.fetch())

    return messages;
  }
);

Meteor.publish("messages.unseen", ({projectId, channel_key, userId, includeBlocked}) => {
  let query = {
    projectId,
    channel_key,
    seen: {"$nin": [userId]},
    $or: [{ sender: userId }, { recipients: userId }]
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }
  let options = {
    //sort: {createdAt: -1},
    //fields: {_id:1, channel_key: 1, seen: 1}
  }
  let messages = Messages.find(query, options);
  //console.log("messages.unseen", messages.fetch())
  return messages;
});


Meteor.publish("messages.unhandled", ({projectId, includeBlocked}) => {
  let query = {
    projectId,
    handledAt: { $exists: false },
    origin: { $not: { $in: ["handler"] } }
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }
  let messages = Messages.find(query, {sort: {createdAt: -1}});
  // console.log("messages.unhandled count: " + messages.count(), messages.fetch())
  return messages;
});

// provides unexecuted events sorted by execTime
Meteor.publish("scheduled_events", ({projectId, anyStatus}) => {
  let query = {
    projectId
  }
  if (!anyStatus) {
    query.status = 'scheduled'
  }
  let events = ScheduledEvents.find(query, {sort: {execTime: -1}});
  return events;
});

// publish roleAssignments
Meteor.publish("roleAssignment", function () {
  if (this.userId) {
    if (userIsInRoles(this.userId, ['admin'])) {
      // console.log("publishing ALL roleAssignments to admin user ", this.userId)
      return Meteor.roleAssignment.find({});
    } else {
      // console.log("publishing LIMITED roleAssignments to user ", this.userId)
      return Meteor.roleAssignment.find({ 'user._id': this.userId });
    }
  } else {
    this.ready()
  }
})
