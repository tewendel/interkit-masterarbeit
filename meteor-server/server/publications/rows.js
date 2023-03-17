import { Meteor } from 'meteor/meteor';
import { Rows } from '../../imports/collections.js';

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
