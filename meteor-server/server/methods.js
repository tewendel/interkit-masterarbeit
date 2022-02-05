import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages } from '../imports/collections.js';
import { duplicateProject, exportProject } from '../imports/projectUtils.js'
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs')
const fse = require('fs-extra');

const getRepoPath = (projectId) => {
  return process.env.REPOSITORIES_PATH + "/projects/" + projectId
}

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

  // create a front end user for a project
  'createProjectUser': async function ({
    projectId,
    username,
    email,
    password,
    projectData
  }) {
    if (!projectId) return false
    Accounts.createUser({
      username,
      email,
      password,
      projectUserData: {
        [projectId]: projectData
      }
    })
  },

  // create a front end user for a project, identified by a user token
  'createProjectTokenUser': async function (params) {
    console.log("createProjectTokenUser", params)
    let {
      projectId,
        userToken,
        projectData
    } = params
    if (!projectId) return false
    if (!userToken) {
      userToken = ""
      while (userToken.length < 6) {
        userToken += Math.random().toString(36).slice(2);
      }
    }
    const username = uuidv4()
    const userId = Accounts.createUser({
      username,
    })

    const projectUserData = {
      [projectId]: {
        ...projectData,
        userToken
      }
    }

    Meteor.users.update(userId,{$set: { projectUserData }})

    const user = Meteor.users.findOne(userId)
    console.log("created token user", user)

    return userToken
  },

  'generateLoginCredentialsForTokenUser': async function({
    projectId,
    userToken
  } = {}){
    if (!projectId || !userToken) return false
    console.log("generateLoginCredentialsForTokenUser", projectId, userToken)
    const user = Meteor.users.findOne({
      [`projectUserData.${projectId}.userToken`] : userToken
    })
    console.log("generateLoginCredentialsForTokenUser userId", user?._id)
    if (!user) { 
      return {
        error: user
      }
    } else {
      // set a random password to be able to log in
      const randomPassword = uuidv4()
      Accounts.setPassword(
        user._id,
        randomPassword,
        {logout:false}
      )
      return {
        username: user.username,
        password: randomPassword
      }
    }
  },

  'resumeUserSession': async function (userAuth) {
     
    if(userAuth?.token) {
      let hashedToken = Accounts._hashLoginToken(userAuth?.token)
      let query = { 'services.resume.loginTokens.hashedToken': hashedToken }    
      let user = Meteor.users.findOne(query);

      if(user) {
        // user found by token, logging user in on server
        this.setUserId(user._id);
        return true;
      }
    }

    return false;
  },

  // save project data to user
  'user.saveElementProperties': async function ({projectId, elementProperties}) {
    const result = Meteor.users.update(Meteor.userId(), {
      $set: {
        [`projectUserData.${projectId}.elementProperties`] : elementProperties
      }
    })
    return result
  },

  // create repo  
  'project.create': async ({ name }) => {

      let projectId = await Projects.insert({ name, slug: name });
      // bundler will be notified via subscription
  },

  'project.remove': async ({ projectId }) => {
      Projects.remove(projectId);
  },


  'project.rename': async ({ projectId, newName }) => {
    console.log("proejct.rename", projectId, newName)
    let project = Projects.find(projectId);
    if(project) {
      Projects.update({_id: projectId}, {$set: { name: newName }})
    }
  },

  'project.duplicate': async ({ projectId }) => {
      return duplicateProject(projectId)
  },

  'project.list': async ({ projectId }) => {
      const files = await fs.promises.readdir(getRepoPath(projectId))
      return files;
  },

  'project.setSlug': async ({ projectId, slug }) => {
    console.log("setSlug", projectId, slug, Projects.findOne({ slug }), Meteor.userId() )
    if (!Projects.findOne({ slug }) ) {
      const res = Projects.update({_id: projectId}, { $set: { slug } })
      console.log("setSlug result", res)
      return slug
    } else {
      return false
    }
    
  },

  'project.getId': async ({ slug }) => {
    let project = Projects.findOne({ slug });
    console.log("getId for slug", slug, project?._id);
    if(project) {
      return project._id
    } else {
      return null
    }
  },

  'project.projectServer.init': async ({ projectId }) => {
    //console.log("project.projectServer.init", projectId)
    const res = Projects.update({_id: projectId}, { $set: { projectServer: {
      status: "init",
      messages: [
        {
          type: "system",
          text: "Initializing project server...",
          date: new Date()
        }
      ]
    } } })
    //console.log("project.projectServer.init result", res)
    return res
  },

  'project.projectServer.addMessage': async ({ projectId, message }) => {
    if (!message.date) {
      message.date = new Date()
    }
    //console.log("project.projectServer.addMessage", projectId, message)
    const res = Projects.update({_id: projectId}, { $push: { 'projectServer.messages': message } })
    //console.log("project.projectServer.addMessage result", res)
    return res
  },

  'project.projectServer.clearMessages': async ({ projectId }) => {
    //console.log("project.projectServer.clearMessags", projectId)
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.messages': [] } })
    //console.log("project.projectServer.clearMessags result", res)
    return res
  },

  'project.projectServer.setStatus': async ({ projectId, status }) => {
    //console.log("project.projectServer.setStatus", projectId, status)
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.status': status } })
    //console.log("project.projectServer.setStatus result", res)
    return res
  },

  'project.projectServer.start': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': "start" } })
  },

  'project.projectServer.stop': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': "stop" } })
  },

  'project.projectServer.resetRequestedAction': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': null } })
  },

  'project.makeDefaultProject': async ({ projectId }) => {
    console.log("makeDefaultProject", projectId, Meteor.userId())
    if (Projects.findOne(projectId)) {
      const resUnset = Projects.update({ _id: { $ne: projectId }}, { $set: { isDefaultProject: false } }, { multi: true})
      const resSet = Projects.update({ _id: projectId }, { $set: { isDefaultProject: true } })
      console.log("isDefaultProject result", resSet, resUnset)
      return true
    } else {
      return false
    }

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
      //console.log("file.load", filename, projectId)
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
      //console.log("data", data.toString());
      return {filename, content: data ? data.toString() : null, error};
  },

  'file.save': async ({file, projectId})  => {
    //console.log("file.save", file, projectId)
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

  'row.delete': ({key, projectId}) => {
    if(key && projectId && Meteor.userId()) {
      if (Meteor.isServer) {
        console.log("row.delete", key, projectId)
        Rows.remove({key, projectId})
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

  'sheet.rename': ({key, projectId, name}) => {
    let sheet = Sheets.findOne({key, projectId});
    if(sheet) {
      Sheets.update({_id: sheet._id}, {$set: {name: name}});
    }
  },

  'message.send': ({projectId, channel_key, sender, recipients = [], payload, origin}) => {
    Messages.insert({
      projectId,
      sender,
      recipients,
      channel_key,
      payload,
      origin,
      createdAt: new Date()
    })
    
    // this is where the message will need to be processed by the project server logic
    
    /*
    // for now we add a fake response message adressed to the user
    Messages.insert({
      projectId,
      recipients: [sender],
      channel_key,
      payload: {
        type: "text",
        text: "ok"
      }      
    })
    */

  },

  'message.setHandled': ({messageId, handledBy = []}) => {
    console.log("message.setHandled", messageId, handledBy)
    Messages.update({_id: messageId}, {$set: {handledAt: new Date(), handledBy}})
  }
  
});
