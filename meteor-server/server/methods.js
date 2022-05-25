import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages, Channels } from '../imports/collections.js';
import { duplicateProject, exportProject, makeProjectHistoryEntry } from '../imports/projectUtils.js'
import { v4 as uuidv4 } from 'uuid';
import * as pushnotifications from '../imports/pushnotifications.js'

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

const updateUserProjectData = async (userId, projectId, key, value) => {
  // write projectData updates to user
  const usersModifiedCount = await Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.${key}`] : value
    }
  })
  return usersModifiedCount
}

const getUserProjectData = (userId, projectId) => {
  const user = Meteor.users.findOne(userId);
  //console.log("getProjectUserData", user)
  let data = user?.projectUserData[projectId];
  if(!data) data = {}
  return data;
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
    if (!projectId) {
      console.warn("createProjectUser: missing projectId")
      return false
    }
    const userId = Accounts.createUser({
      username,
      email,
      password,
    })

    const projectUserData = {
      [projectId]: projectData
    }

    Meteor.users.update(userId, { $set: { projectUserData } })

    console.log("createProjectUser", userId)
  },

  'users.delete': async function (ids) {
    console.log('deleteProjectUsers', ids)
    const result = await Meteor.users.remove({ _id: { $in: ids } })
    return result
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

  'user.savePushnotificationRegistrationToken': async function ({projectId, token}) {
    const result = Meteor.users.update(Meteor.userId(), {
      $set: {
        [`projectUserData.${projectId}.lastHeartbeat`] : new Date(),
        [`projectUserData.${projectId}.pushnotificationRegistrationToken`] : token
      }
    })
    return result
  },

  'user.heartbeat': async function ({ projectId, userId, isAwake }) {
    // Meteor.userId() is not super reliable?
    userId = userId || Meteor.userId()
    // console.log('heartbeat', projectId, userId, isAwake)
    if (!userId) {
      console.log('heartbeat w/o userId, skipping')
      return
    }
    const result = Meteor.users.update(userId, {
      $set: {
        // isAwake===false forces "asleep" by setting into the past, slightly over threshold
        // (we could use start of epoch (and lose some stats), or a dedicated bool to be cleaner)
        [`projectUserData.${projectId}.lastHeartbeat`] : isAwake === false
          ? new Date(+(new Date()) - pushnotifications.heartbeatOldMinAge - 1000)
          : new Date()
      }
    })
    return result
  },

  // create repo  
  'project.create': async ({ name, template, gitRepository }) => {
    
    const doc = { 
      name, 
      slug: name,
      history: [
        makeProjectHistoryEntry("create_project", {
          template,
          gitRepository
        })
      ]
    }

    let projectId = await Projects.insert(doc);

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
    const res = Projects.update({_id: projectId}, { 
      $push: {
          'projectServer.messages': {
            $each: [ message ],
            $sort: { date: -1 },
            $slice: 500 // limit the number of messages
          }
        }
      })
    
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

  // update a section in project uiState
  // -> project.uiState[section] = data
  'project.updateUiState': async ({ projectId, section, data }) => {
    const res = Projects.update({
        _id: projectId,
    }, {
        $set: {
          [`uiState.${section}`]: data
        }
    });
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

  'sheet.getRows': ({sheetKey, projectId}) => {
    console.log("sheet.getRows", sheetKey, projectId)
    const rows = Rows.find({sheetKey: sheetKey, projectId}).fetch();
    return rows;
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
        // return the updated row
        return Rows.findOne({ key: rowKey, projectId })
      } else {
        console.log("updateValue: row not found")
      }
    }
  },

  'row.updateValues': ({rowKey, projectId, values}) => {
    console.log("row.updateValues", rowKey, projectId, values);
    if(rowKey && projectId && values) {
      let row = Rows.findOne({key: rowKey, projectId})
      if(row) {
        Rows.update({_id: row._id}, {$set: {values}});
        // return the updated row
        return Rows.findOne({ key: rowKey, projectId })
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

  'sheet.rename': ({key, projectId, name}) => {
    let sheet = Sheets.findOne({key, projectId});
    if(sheet) {
      Sheets.update({_id: sheet._id}, {$set: {name: name}});
    }
  },

  'channel.create': ({projectId, channel_key}) => {
    console.log("channel.create", projectId, channel_key)
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      console.log("channel already exists, aborting")
      return;
    }
    Channels.insert({projectId, channel_key, active: true})
  },

  'channel.delete': ({projectId, channel_key}) => {
    console.log("channel.delete")
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      Channels.remove({_id: channels[0]._id})
    } else {
      console.log("channel.delete - channel not found", projectId, channel_key)
    }
  },

  'channel.setProperty': ({projectId, channel_key, property, value}) => {
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      Channels.update({_id: channels[0]._id}, {$set: {[property]: value}})
    } else {
      console.log("channel.setProperty - channel not found", projectId, channel_key)
    }
  },

  'channel.seeAll': ({projectId, channel_key, userId}) => {
    console.log("channel.seeAll", channel_key, userId)
    Messages.update(
      {projectId, channel_key: channel_key, seen: {"$nin": [userId]}}, 
      {$push: {seen: userId}},
      {multi: true}
    );
  },
 
  'message.setHandled': ({messageId, handledBy = []}) => {
    console.log("message.setHandled", messageId, handledBy)
    Messages.update({_id: messageId}, {$set: {handledAt: new Date(), handledBy}})
  },

  'message.submitChoice': ({projectId, channel_key, sender, messageId, selectedKey}) => {
    console.log("### selecting ", messageId, selectedKey)
    Messages.update({_id: messageId}, {$set: {selectedChoiceKey: selectedKey}})

    Messages.insert({
      projectId,
      sender,
      recipients: [],
      channel_key,
      payload: {type: "select", key: selectedKey},
      origin: undefined,
      createdAt: new Date()
    })
  },

  'message.send': ({projectId, channel_key, sender, recipients = [], payload, origin}) => {
    const userId = Meteor.userId()
    console.log('message.send', { payload, channel_key, recipients, sender, userId })
    const messageResult = Messages.insert({
      projectId,
      sender,
      recipients,
      channel_key,
      payload,
      origin,
      createdAt: new Date()
    })

    if (messageResult) {
      // TODO: there is no return value here, no way to report errors to admin?
      pushnotifications.send({ projectId, Meteor, recipients, payload })
    }
    
  },

  'messages.delete': async function (ids) {
    console.log('messages.delete', ids)
    const result = await Messages.remove({ _id: { $in: ids } })
    return result
  },

  'user.get': ({userId}) => {
    const user = Meteor.users.findOne(userId)
    return user;
  },

  'user.getProjectUserData': ({userId, projectId}) => {
    return getUserProjectData(userId, projectId)
  },

  'user.updateUserProjectData': async ({userId, projectId, key, value}) => {
    await updateUserProjectData(userId, projectId, key, value);
    return true;
  },

  'user.getUserVar': ({userId, projectId, varName}) => {
    let userProjectData = getUserProjectData(userId, projectId);
    return userProjectData?.userVars?.[varName]
  },

  'user.setUserVar': async ({userId, projectId, varName, value}) => {
    console.log("user.setUserVar", varName, value)
    let userProjectData = getUserProjectData(userId, projectId);
    let userVars = userProjectData.userVars
    if(!userVars) {
      userVars = {};
    }
    userVars[varName] = value
    await updateUserProjectData(userId, projectId, "userVars", userVars)
  },

  'users.getForNode': ({projectId, boardId, nodeId}) => {
    let nodeIdKey = `projectUserData.${projectId}.boardState.${boardId}.nodeId`
    let statusKey = `projectUserData.${projectId}.boardState.${boardId}.status`
    let query = {[nodeIdKey]: nodeId, [statusKey]: "arrived"};
    console.log("users.getForNode query", query)
    let users = Meteor.users.find(query).fetch();
    return users;
  },

  'user.moveTo': async ({projectId, userId, boardId, nodeId}) => {
    console.log("user.moveTo", projectId, userId, boardId, nodeId)

    // get user
    const user = await Meteor.users.findOne(userId)
    if(!user) {
      console.log("user.moveTo - user not found")
      return false
    }  
    console.log(user);  

    // TODO: move this logic to the project server!

    // get boardState
    let boardState = user?.projectUserData[projectId]?.boardState;
    if(!boardState) {
      boardState = {}
    }

    // modify boardState
    boardState = {...boardState, [boardId]: {
      status: "arriving",
      nodeId
    }}
    console.log("boardState", boardState);

    const usersUpdatedCount = await updateUserProjectData(userId, projectId, "boardState", boardState)
    return usersUpdatedCount
  }
  
});
