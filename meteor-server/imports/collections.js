import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');

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
*/