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
- recipients <userId>
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
- type // "message", "moveTo"
- status // "scheduled", "done"
- time // execution time
- payload // object, depends on type
*/