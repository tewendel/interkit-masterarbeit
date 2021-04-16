import { Projects, Sheets, Rows } from '../imports/collections.js';
import { duplicateProject } from '../imports/projectUtils.js'
import { v4 as uuidv4 } from 'uuid';

const git = require('isomorphic-git')
const fs = require('fs')
const fse = require('fs-extra');

const getRepoPath = (projectId) => {
   return process.env.REPOSITORIES_PATH + "/projects/" + projectId
}

const addColumn = async ({sheetKey, projectId, colKey, name, type}) => {

  if(!name) name = "unnamed column";
  if(!colKey) colKey = uuidv4();
  if(!type) type = "string";

  let sheet = Sheets.findOne({key: sheetKey, projectId});
   if(sheet) {
     let cols = sheet.columns;
     if(!cols) cols = [];
     cols.push({
       key: colKey,
       name,
       type,
     })
     sheet.columns = cols;
     Sheets.update({_id: sheet._id}, {$set: {columns: cols}});
   }
}

const addRow = async ({sheetKey, projectId})  => {
   Rows.insert({
     key: uuidv4(),
     sheetKey: sheetKey,
     values: {},
     projectId
   })           
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

  'project.duplicate': async ({ projectId }) => {
      duplicateProject(projectId)
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

  'sheet.create': async ({projectId, name, sheetKey}) => {
      console.log('sheet.create')

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

   'sheet.addColumn': async ({sheetKey, projectId, colKey, name, type}) => {
     await addColumn({sheetKey, projectId, colKey, name, type});
   },

   'sheet.addRow': ({sheetKey, projectId}) => {
     addRow({sheetKey, projectId})
   },

   'row.updateValue': ({rowKey, projectId, colKey, newVal}) => {
     console.log(rowKey, projectId, colKey, newVal);
     if(rowKey && projectId && colKey) {
       let row = Rows.findOne({key: rowKey, projectId})
       if(row) {
         let values = row.values
         values[colKey] = newVal 
         //console.log(value)
         Rows.update({_id: row._id}, {$set: {values}});
       } else {
         console.log("updateValue: row not found")
       }
     }
   },

   'sheet.updateHeader': ({sheetKey, projectId, colKey, newVal, newType, newReference}) => {
     console.log('sheet.updateHeader', sheetKey, projectId, colKey, newVal, newType, newReference)
     let sheet = Sheets.findOne({key: sheetKey, projectId});
     if(sheet) {
       let cols = sheet.columns;
       let newCols = cols.map(c => {
         if(c.key == colKey) {
           return {...c, name: newVal, type: newType, reference: newReference}
         } else {
           return c
         }
       })
       Sheets.update({_id: sheet._id}, {$set: {columns: newCols}});
     }
   },

   'sheet.rename': ({key, projectId, name}) => {
     let sheet = Sheets.findOne({key, projectId});
     if(sheet) {
       Sheets.update({_id: sheet._id}, {$set: {name: name}});
     }
   },
  
});
