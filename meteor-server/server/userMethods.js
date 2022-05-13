import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages, Channels } from '../imports/collections.js';
import { duplicateProject, exportProject, makeProjectHistoryEntry } from '../imports/projectUtils.js'
import { v4 as uuidv4 } from 'uuid';
import * as pushnotifications from '../imports/pushnotifications.js'

const updateUserProjectData = async (userId, projectId, key, value) => {
  // write projectData updates to user
  await Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.${key}`] : value 
    }
  })  
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
    const user = Meteor.users.findOne(userId)
    if(!user) {
      console.log("user.moveTo - user not found")
      return;
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

    await updateUserProjectData(userId, projectId, "boardState", boardState)
  }
  
});
