import { Projects, Sheets, Rows } from '../imports/collections.js';
import { v4 as uuidv4 } from 'uuid';

const git = require('isomorphic-git')
const fs = require('fs')
const fse = require('fs-extra');
const dotenv = require('dotenv')
dotenv.config({
  path: `${process.env.PWD}/.env`
})

const getRepoPath = (projectId) => {
   return process.env.REPOSITORIES_PATH + "/projects/" + projectId
}

const addColumn = async (sheetId) => {
  let sheet = Sheets.findOne(sheetId);
   if(sheet) {
     let cols = sheet.columns;
     if(!cols) cols = [];
     colKey = uuidv4();
     cols.push({
       key: colKey,
       name: "unnamed column",
       type: "string"
     })
     sheet.columns = cols;
     Sheets.update({_id: sheet._id}, {$set: {columns: cols}});
   }
}

Meteor.methods({

  // create repo  
  'project.create': async ({ name }) => {

      let projectId = await Projects.insert({ name });

      if(projectId) {  
        const starterPath = process.env.REPOSITORIES_PATH + "/starters/cs1"
        const repoPath = getRepoPath(projectId)
        
        // create new directory and initialize repo
        try {
          if (!fs.existsSync(repoPath)) {
            await fs.promises.mkdir(repoPath);
            await git.init({fs, dir: repoPath});
            await fse.copySync(starterPath, repoPath)

          } else {
            console.log("Directory already exists.");
          }
        } catch (err) {
            console.log(err);
        }
      }
  },

  'project.remove': async ({ projectId }) => {
      Projects.remove(projectId);
  },

  'project.list': async ({ projectId }) => {
      const files = await fs.promises.readdir(getRepoPath(projectId))
      return files;
  },

  // add a file to a project
  'file.create': async ({ filename, projectId }) => {
      const filePath = getRepoPath(projectId) + "/" + filename;
      if (!fs.existsSync(filePath)) {
        await fs.promises.writeFile(filePath, "")      
      } else {
        console.log("File already exists.");
      }
  },

  'file.load': async ({filename, projectId}) => {
      const filePath = getRepoPath(projectId) + "/src/" + filename;
      let data;
      let error;

      try {
        // check if file exists
        await fs.promises.access(filePath, fs.constants.F_OK)
        // read data
        data = await fs.promises.readFile(filePath)
      } catch(e) {
        error = e;
      }

      return {filename, content: data ? data.toString() : null, error};
  },

  'file.save': async ({file, projectId})  => {
    const filePath = getRepoPath(projectId) + "/src/" + file.filename;
    await fs.promises.writeFile(filePath, file.content)      
  },

  'bundler.getUrl': async () => {
    return process.env.BUNDLER_URL
  },

  'sheet.create': async ({projectId}) => {
      console.log('sheet.create')
      let sheetId = await Sheets.insert({name: "untitled sheet", columns: [], projectId});
      await addColumn(sheetId)
      Rows.insert({
         sheetId: sheetId,
         value: {}
       })       
      console.log(sheetId);
      return sheetId;
   },

   'sheet.remove': ({sheetId}) => {
      console.log('sheet.remove', sheetId)
      Sheets.remove({_id: sheetId});
      Rows.remove({sheetId: sheetId});
   },

   'sheet.addColumn': async ({sheetId}) => {
     await addColumn(sheetId);
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

   'sheet.updateValue': ({key, rowId, newVal}) => {
     //console.log(key, rowId, newVal);
     if(key && rowId) {
       let row = Rows.findOne(rowId)
       if(row) {
         let value = row.value
         value[key] = newVal 
         //console.log(value)
         Rows.update({_id: rowId}, {$set: {value}});
       } else {
         console.log("updateValue: row not found")
       }
     }
   },

   'sheet.updateHeader': ({sheetId, key, newVal, newType, newReference}) => {
     //console.log('sheet.updateHeader', newType)
     let sheet = Sheets.findOne(sheetId);
     if(sheet) {
       let cols = sheet.columns;
       let newCols = cols.map(c => {
         if(c.key == key) {
           return {...c, name: newVal, type: newType, reference: newReference}
         } else {
           return c
         }
       })
       Sheets.update({_id: sheet._id}, {$set: {columns: newCols}});
     }
   },

   'sheet.rename': ({sheetId, name}) => {
     let sheet = Sheets.findOne(sheetId);
     if(sheet) {
       Sheets.update({_id: sheet._id}, {$set: {name: name}});
     }
   },
  
});
