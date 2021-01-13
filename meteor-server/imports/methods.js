import { Sheets, Rows } from './collections.js'

Meteor.methods({

  'sheet.create': ({projectId}) => {
      console.log('sheet.create')
      let sheetId = Sheets.insert({name: "untitled", columns: [], projectId});
   },

   'sheet.addColumn': ({sheetId}) => {
     let sheet = Sheets.findOne(sheetId);
     if(sheet) {
       let cols = sheet.columns;
       if(!cols) cols = [];
       cols.push({
         name: "col" + cols.length,
         type: "string"
       })
       sheet.columns = cols;
       Sheets.update({_id: sheet._id}, {$set: {columns: cols}});
     }
   },

   'sheet.addRow': ({sheetId}) => {
     let sheet = Sheets.findOne(sheetId);
     if(sheet) {
       Rows.insert({
         sheetId: sheet._id,
         value: {}
       })       
     }
   },

   'sheet.updateValue': ({col, row, newVal}) => {
     if(col && row) {
       let value = row.value
       value[col.name] = newVal
       Rows.update({_id: row._id}, {$set: {value}});
     }
   },

   'sheet.rename': ({sheetId, name}) => {
     let sheet = Sheets.findOne(sheetId);
     if(sheet) {
       Sheets.update({_id: sheet._id}, {$set: {name: name}});
     }
   },

});
