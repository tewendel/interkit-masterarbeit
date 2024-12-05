import { Meteor } from 'meteor/meteor';
import { Sheets, Rows } from '../../imports/collections.js';
import { v4 as uuidv4 } from 'uuid';

const addColumn = async ({sheetKey, projectId, colKey, name, type, reference, options}) => {

  console.log("addColumn with reference", reference)

  if(!name) name = "unnamed column";
  if(!colKey) colKey = uuidv4();
  if(!type) type = "string";

  let sheet = Sheets.findOne({key: sheetKey, projectId});
    if(sheet) {
      let cols = sheet.columns;
      if(!cols) cols = [];
      let newCol = {
        key: colKey,
        name,
        type,
        reference,
        options
      }
      cols.push(newCol)
      sheet.columns = cols;
      Sheets.update({_id: sheet._id}, {$set: {columns: cols}});
      return newCol;
    }
}

const removeColumn = async ({sheetKey, projectId, colKey}) => {
  if(sheetKey && projectId && colKey) {
    let sheet = Sheets.findOne({key: sheetKey, projectId});
    if(sheet) {
      let cols = sheet.columns;
      let removeIndex = cols.findIndex(c=>c.key == colKey)
      cols.splice(removeIndex, 1)
      Sheets.update({_id: sheet._id}, {$set: {columns: cols}});

      // todo: test integrity of references?
    }
  }
}

// move an element in an array to a new index
const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


const moveColumn = async ({sheetKey, projectId, colKey, direction}) => {
  //console.log("moveColumn")
  if(sheetKey && projectId && colKey) {
    let sheet = Sheets.findOne({key: sheetKey, projectId});
    if(sheet) {
      let cols = sheet.columns;
      let moveIndex = cols.findIndex(c=>c.key == colKey)
      let changed = false;
      if(direction == -1 && moveIndex > 0) {
        array_move(cols, moveIndex, moveIndex - 1);
        changed = true;
      }
      if(direction == 1 && moveIndex < cols.length - 1) {
        array_move(cols, moveIndex, moveIndex + 1);
        changed = true;
      }
      //console.log(changed, cols);  
      if(changed)
        Sheets.update({_id: sheet._id}, {$set: {columns: cols}});
    }
  }
}

const addRow = async ({sheetKey, projectId})  => {
    const key = uuidv4()
    Rows.insert({
      key,
      sheetKey: sheetKey,
      values: {},
      projectId
    })
    // console.log("addRow", key)
    return {
      rowKey: key
    }
}

// updates the row objects after a column key has been changed
const updateRowsWithNewColKey = async ({sheetKey, projectId, oldColKey, newColKey}) => {
  console.log("updateRowsWithNewColKey", oldColKey, newColKey);
  let rows = Rows.find({sheetKey, projectId}).fetch()
  for(let row of rows) {    
    let values = row.values
    values[newColKey] = values[oldColKey]
    delete values[oldColKey];
    console.log(values);
    Rows.update({_id: row._id}, {$set: {values}});
  }    
}

Meteor.methods({

  'sheet.create': async ({projectId, name, sheetKey}) => {
      console.log('sheet.create', projectId, name, sheetKey)

      if(!name) name = "untitled sheet"
      if(!sheetKey) sheetKey = uuidv4(); // create a new key for this sheet
      
      if(projectId) {

        let sheetId = await Sheets.insert({
          name,
          key: sheetKey, 
          columns: [], 
          projectId
        });
        
        //await addColumn({sheetKey, projectId})
        //await addRow({sheetKey, projectId})
        return sheetKey;
      }
  },

  'sheet.remove': ({sheetKey, projectId}) => {
      console.log('sheet.remove', sheetKey, projectId)
      if(sheetKey && projectId) {
        let sheet = Sheets.findOne({key: sheetKey, projectId})
        if(sheet) {
          Sheets.remove({_id: sheet._id});
          Rows.remove({sheetKey: sheetKey, projectId});
        }
      }
  },

  'sheet.duplicate': async ({sheetKey, projectId, name}) => {
    console.log('sheet.duplicate', sheetKey, projectId, name)
    if(sheetKey && projectId) {
      // copy the sheet
      const sheet = Sheets.findOne({key: sheetKey, projectId})
      delete sheet._id
      const newSheetKey = uuidv4()
      Sheets.insert({
        ...sheet,
        key: newSheetKey,
        name: name ? name : sheet.name + " copy",
      }) 

      // copy all the rows
      const rows_cursor = Rows.find({sheetKey: sheet.key, projectId})

      for await (let doc of rows_cursor) {
          delete doc._id
          await Rows.insert({
            ...doc,
            sheetKey: newSheetKey,
            key: uuidv4(),
          })
      }
    }
  },

  'sheet.addColumn': async (options) => {
    return await addColumn(options);
  },

  'sheet.moveColumn': async ({sheetKey, projectId, colKey, direction}) => {
    console.log("sheet.moveColumn")
    if(Meteor.userId()) {
      await moveColumn({sheetKey, projectId, colKey, direction});
    }
  },

  'sheet.removeColumn': async ({sheetKey, projectId, colKey}) => {
    if(Meteor.userId()) {
      await removeColumn({sheetKey, projectId, colKey});
    }
  },

  'sheet.addRow': ({sheetKey, projectId}) => {
    return addRow({sheetKey, projectId})
  },

  'sheet.getRows': ({sheetKey, projectId}) => {
    console.log("sheet.getRows", sheetKey, projectId)
    const rows = Rows.find({sheetKey: sheetKey, projectId}).fetch();
    return rows;
  },

  'sheet.clearRows': ({sheetKey, projectId}) => {
    console.log("sheet.clearRows", sheetKey, projectId)
    let result = false
    if(sheetKey && projectId) {
      result = Rows.remove({sheetKey, projectId});
    }
    return result;
  },

  'row.updateValue': ({rowKey, projectId, colKey, newVal}) => {
    console.log(rowKey, projectId, colKey, newVal);
    if(rowKey && projectId && colKey) {
      const result = Rows.update(
        {key: rowKey, projectId},
        {$set: {[`values.${colKey}`]: newVal}}
      );
      if(result) {
        return Rows.findOne({key: rowKey, projectId});
      } else {
        console.log("updateValue: row not found");
      }
    }
  },

  'row.updateValues': ({rowKey, projectId, values}) => {
    console.log("row.updateValues", rowKey, projectId, values);
    if(rowKey && projectId && values) {
      const result = Rows.update(
        {key: rowKey, projectId},
        {$set: {values}}
      );
      if(result) {
        return Rows.findOne({key: rowKey, projectId});
      } else {
        console.log("updateValues: row not found");
      }
    }
  },

  'row.delete': ({key, projectId}) => {
    if(key && projectId && Meteor.userId()) {
      if (Meteor.isServer) {
        console.log("row.delete", key, projectId)
        Rows.remove({key, projectId})
      }
    }
  },

  'row.duplicate': ({ key, projectId }) => {
    if (key && projectId && Meteor.userId()) {
      if (Meteor.isServer) {
        console.log("row.duplicate", key, projectId)
        let row = Rows.findOne({ key, projectId })
        if (row) {
          delete row._id
          const newKey = uuidv4()
          Rows.insert({
            ...row,
            key: newKey,
          })
          // console.log("addRow", key)
          return {
            rowKey: newKey
          }
        }
      }
    }
  },

  'sheet.updateHeader': ({sheetKey, projectId, colKey, newVal, newType, newReference, options, newColKey}) => {
    console.log('sheet.updateHeader', sheetKey, projectId, colKey, newVal, newType, newReference, newColKey)
    let sheet = Sheets.findOne({key: sheetKey, projectId});
    if(sheet) {
      if((newColKey != colKey) && sheet.columns.find(c=>c.key == newColKey)) {
        console.log("abort renaming column if it already exists in sheet")
        return
      }
      let cols = sheet.columns;
      let newCols = cols.map(c => {
        if(c.key == colKey) {
          return {...c, name: newVal, type: newType, reference: newReference, options, key: newColKey ? newColKey : colKey}
        } else {
          return c
        }
      })
      Sheets.update({_id: sheet._id}, {$set: {columns: newCols}});
      if((colKey != newColKey) && newColKey) {
        updateRowsWithNewColKey({sheetKey, projectId, oldColKey: colKey, newColKey});
      }
    }
  },

  'sheet.rename': ({ projectId, id, key, name }) => {
    // get current key
    const sheet = Sheets.findOne({ _id: id });
    const oldKey = sheet.key;
    // just rename if key is the same
    if (!key || oldKey === key) {
      console.log(`sheet.rename: rename sheet, keep key ${name}`)
      return Sheets.update({ _id: id }, { $set: { name } })
    }
    // check if key is unique
    if (Sheets.findOne({ key, projectId })) {
      console.log("sheet.rename: key not unique", key)
      return false
    }
    console.log("sheet.rename: rename sheet and key", name, key)
    // update key and name
    const res = Sheets.update({ _id: id }, { $set: { key, name } })
    if (res === 1) {
      // update all rows with new key
      Rows.update({ sheetKey: oldKey, projectId }, { $set: { sheetKey: key } }, { multi: true })
    }
    return res
  },
  
});
