import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');

/*
- name
- slug
- isDefaultProject <bool>
- history [
    {
      event <string> // create_project, ...
    }
  ]
- projectServer {
    status: <string>, // running, stopped, ...
    actionRequested: <string> // start, stop, null
    cpu: <number>, // current cpu usage, 1 equals 100% of 1 core
    messages: [{
      type: <string>, // stdout, stderr, system, ...
      text: <string>,
      date: <datetime>
    }]
  }
- uiState
*/

export const Sheets = new Mongo.Collection('sheets');

/*
- projectId
- key
- columns: {
    - key
    - name
    - type
    - reference
}
*/

export const Rows = new Mongo.Collection('rows');

/*
- projectId
- key
- slug
- sheetKey
- values: {
  [colKey]: 
  [colKey]: 
}
*/

export const Messages = new Mongo.Collection('messages');

/*
- projectId
- sender <userId>
- recipients [<userId>]
- outputOrder
- channel_key
- payload {
    - type // "text"
    - text
  }
- createdAt <Date>
- handledAt <Date>
- handledBy <array>
- origin <string> // null (=user?), handler, cron
- seen // array of userIds that have seen the message
*/

export const Channels = new Mongo.Collection('channels');

/*
- projectId
- channel_key
- active <bool>
- title <string> // "Goserider Platz"
- label <string> // "Gruppenchat"
- image <mediaFile red {type: "mediafile", value: "id"}>
- lastMessageSent <Date>
*/

export const ScheduledEvents = new Mongo.Collection('scheduled_events');

/*
- projectId
- method // "message.send", "user.moveTo"
- status // "scheduled", "done"
- execTime // execution time
- payload // object, depends on type
*/

if (Meteor.isServer && Messages._driver.mongo._oplogHandle) {
  console.log('oplog is enabled');
} else {
  console.log('oplog is NOT enabled !!');
}

// create indexes for full text search
Meteor.startup(() => {
  Messages.createIndex({ 
    "payload.options.label": "text", 
    "payload.text": "text", 
    "channel_key": "text", 
    "sender": "text", 
    "recipients": "text"
  }, {
    default_language: "none"
  })
});