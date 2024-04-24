import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { v4 as uuidv4 } from 'uuid';
import * as pushnotifications from '../../imports/pushnotifications.js'
import { addUsersToRoles, userIsInRoles } from '../../imports/userRoles.js';
import { seedUser } from '../../imports/userUtils.js';
import { processUserActivity } from '../../imports/userActivity.js';

let projectServerPasswords = {}

const updateUserProjectData = async (userId, projectId, key, value) => {
  // write projectData updates to user
  const usersModifiedCount = await Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.${key}`] : value 
    }
  })
  return usersModifiedCount
}

const initialiseUserBoardState = async (userId, projectId, boardId) => {
  const key = `projectUserData.${projectId}.boardState` + (boardId ? '.' + boardId : '')
  const modifiedCount = await Meteor.users.update({ _id: userId }, { $set: { [key]: {} } })
  console.log(`initialiseUserBoardState, user ${userId}, project ${projectId}, board ${boardId}, modified ${modifiedCount}`)
  return modifiedCount
}

const updateUserBoardArrivalState = async (userId, projectId, boardId, value) => {
  // write projectData updates to user
  const $setLastArrived = {}
  if (value.status === 'arrived') {
    const now = new Date()
    $setLastArrived[`projectUserData.${projectId}.boardState.${boardId}.lastArrived`] = now 
    $setLastArrived[`projectUserData.${projectId}.boardLastArrived`] = now 
  }
  const usersModifiedCount = Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.boardState.${boardId}.nodeId`] : value.nodeId,
      [`projectUserData.${projectId}.boardState.${boardId}.status`] : value.status,
      ...$setLastArrived
    }
  })
  return usersModifiedCount
}

const updateUserBoardInterface = async (userId, projectId, boardId, value) => {
  // write projectData updates to user
  if (!value._updatedAt) value._updatedAt = new Date()
  const usersModifiedCount = Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.boardState.${boardId}.interfaceConfig`] : value      
    }
  })
  return usersModifiedCount
}

const updateUserElementProperty = async (userId, projectId, elementKey, propertyName, value) => {
  // write projectData updates to user
  const usersModifiedCount = Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.elementProperties.${elementKey}.${propertyName}`] : value      
    }
  })
  return usersModifiedCount
}

const updateUserChannelProperty = async (userId, projectId, channelKey, propertyName, value) => {
  // write projectData updates to user
  const usersModifiedCount = Meteor.users.update(userId, {
    $set: {
      [`projectUserData.${projectId}.channelProperties.${channelKey}.${propertyName}`] : value      
    }
  })
  return usersModifiedCount
}


const updateUsersVar = async (selector, projectId, varName, value) => {
  // write projectData updates to users
  console.log('updateUsersVar', selector, projectId, varName, value)
  // console.log('updateUsersVar', Meteor.users.find(selector).fetch())
  const usersModifiedCount = Meteor.users.update(
    selector,
    {
      $set: {
        [`projectUserData.${projectId}.userVars.${varName}`] : value
      }
    },
    {
      // not super exact, but good enough
      // (typeof check also true for arrays; an object selector might still mean to select one...)
      multi: typeof selector === 'object'
    }
  )
  return usersModifiedCount
}



const getUserProjectData = (userId, projectId) => {
  const user = Meteor.users.findOne(userId);
  //console.log("getProjectUserData", user)
  let data = user?.projectUserData?.[projectId];
  if(!data) data = {}
  return data;
}

const getBoardState = async (projectId, userId, boardId, doCreateIfNotExists) => {
  // get user
  let user = await Meteor.users.findOne(userId)
  if (!user) {
    console.warn(`getBoardState user ${userId} not found`)
    return
  }  
  if (!user.projectUserData) {
    console.warn(`getBoardState user ${userId} has no projectUserData`)
    // console.log(user)
    return
  }
  if (!user.projectUserData[projectId]) {
    console.warn(`getBoardState user ${userId} has no projectUserData for project ${projectId}`)
    // console.log(user.projectUserData)
    return
  }
  if (!user.projectUserData[projectId].boardState) {
    console.log(`getBoardState user ${userId} has no boardState for project ${projectId}`)
    if (doCreateIfNotExists) {
      const initialised = await initialiseUserBoardState(userId, projectId)
      if (!initialised) return
      user = await Meteor.users.findOne(userId)
    } else {
      // console.log(user.projectUserData[projectId])
      return
    }
  }
  if (boardId && !user.projectUserData[projectId].boardState[boardId]) {
    console.log(`getBoardState user ${userId} has no boardState for project ${projectId}, board ${boardId}`)
    if (doCreateIfNotExists) {
      const initialised = await initialiseUserBoardState(userId, projectId, boardId)
      if (!initialised) return
      user = await Meteor.users.findOne(userId)
    } else {
      return
    }
  }
  // N.B. pretty weird that we pass boardId but return boardState (the parent)
  return user.projectUserData[projectId]?.boardState
}

Meteor.methods({
  // create a front end user for a project
  createProjectUser: async function ({
    projectId,
    username,
    email,
    password,
    projectData,
  }) {
    if (!projectId) {
      console.warn("createProjectUser: missing projectId");
      return false;
    }
    const userId = Accounts.createUser({
      username,
      email,
      password,
    });

    const projectUserData = {
      [projectId]: projectData,
    };

    Meteor.users.update(userId, { $set: { projectUserData } });

    console.log("createProjectUser", userId);
  },

  "users.delete": async function (ids) {
    console.log("deleteProjectUsers", ids);
    const result = await Meteor.users.remove({ _id: { $in: ids } });
    return result;
  },

  // create a front end user for a project, identified by a user token
  createProjectTokenUser: async function (params) {
    console.log("createProjectTokenUser", params);
    let { projectId, userToken, projectData } = params;
    if (!projectId) return false;
    if (!userToken) {
      userToken = "";
      while (userToken.length < 6) {
        userToken += Math.random().toString(36).slice(2);
      }
    }
    const username = uuidv4();
    const userId = Accounts.createUser({
      username,
    });

    addUsersToRoles(userId, ["projectuser"]);

    const projectUserData = {
      [projectId]: {
        ...projectData,
        userToken,
      },
    };

    Meteor.users.update(userId, { $set: { projectUserData } });

    const user = Meteor.users.findOne(userId);
    console.log("created token user", user);

    return userToken;
  },

  generateLoginCredentialsForTokenUser: async function ({
    projectId,
    userToken,
  } = {}) {
    if (!projectId || !userToken) return false;
    console.log("generateLoginCredentialsForTokenUser", projectId, userToken);
    const user = Meteor.users.findOne({
      [`projectUserData.${projectId}.userToken`]: userToken,
    });
    console.log("generateLoginCredentialsForTokenUser userId", user?._id);
    if (!user) {
      return {
        error: user,
      };
    } else {
      // set a random password to be able to log in
      const randomPassword = uuidv4();
      Accounts.setPassword(user._id, randomPassword, { logout: false });
      return {
        username: user.username,
        password: randomPassword,
      };
    }
  },

  resumeUserSession: async function (userAuth) {
    if (userAuth?.token) {
      let hashedToken = Accounts._hashLoginToken(userAuth?.token);
      let query = { "services.resume.loginTokens.hashedToken": hashedToken };
      let user = Meteor.users.findOne(query);

      if (user) {
        // user found by token, logging user in on server
        this.setUserId(user._id);
        return true;
      }
    }

    return false;
  },

  // save project data to user
  "user.saveElementProperties": async function ({
    projectId,
    elementProperties,
  }) {
    const result = Meteor.users.update(Meteor.userId(), {
      $set: {
        [`projectUserData.${projectId}.elementProperties`]: elementProperties,
      },
    });
    return result;
  },

  "user.savePushnotificationRegistrationToken": async function ({
    projectId,
    token,
  }) {
    /* if user was reset manually we have to take away their/our token, to prevent receiving multiple push notifications */
    if (token !== "(web)") {
      Meteor.users.update(
        {
          [`projectUserData.${projectId}.pushnotificationRegistrationToken`]:
            token,
        },
        {
          $set: {
            [`projectUserData.${projectId}.pushnotificationRegistrationToken`]:
              "(userreset)",
          },
        }
      );
    }
    const result = Meteor.users.update(Meteor.userId(), {
      $set: {
        [`projectUserData.${projectId}.lastHeartbeat`]: new Date(),
        [`projectUserData.${projectId}.pushnotificationRegistrationToken`]:
          token,
      },
    });
    return result;
  },

  "user.saveWebPushSubscription": async function ({
    projectId,
    userId,
    subscription
  }) {
    if (!userId) {
      console.error('user.saveWebPushSubscription no userId')
      return false
    }
    console.log('user.saveWebPushSubscription', arguments)
    console.log('user.saveWebPushSubscription', { projectId, userId, subscription })
    const result = Meteor.users.update(userId, {
      $set: {
        [`projectUserData.${projectId}.lastHeartbeat`]: new Date(),
        //[`projectUserData.${projectId}.webPushSubscription`]: subscription
        webPushSubscription: subscription
      }
    });
    return result;
  },

  "user.heartbeat": async function ({ projectId, userId, isAwake }) {
    // Meteor.userId() is not super reliable?
    userId = userId || Meteor.userId();
    // console.log('heartbeat', projectId, userId, isAwake)
    if (!userId) {
      console.log("heartbeat w/o userId, skipping");
      return;
    }
    const result = Meteor.users.update(userId, {
      $set: {
        // isAwake===false forces "asleep" by setting into the past, slightly over threshold
        // (we could use start of epoch (and lose some stats), or a dedicated bool to be cleaner)
        [`projectUserData.${projectId}.lastHeartbeat`]:
          isAwake === false
            ? new Date(
                +new Date() - pushnotifications.heartbeatOldMinAge - 1000
              )
            : new Date(),
      },
    });
    return result;
  },

  "user.get": ({ userId }) => {
    const user = Meteor.users.findOne(userId);
    return user;
  },

  "user.getProjectUserData": ({ userId, projectId }) => {
    return getUserProjectData(userId, projectId);
  },

  "user.updateUserProjectData": async ({ userId, projectId, key, value }) => {
    await updateUserProjectData(userId, projectId, key, value);
    return true;
  },

  "user.updateUserBoardArrivalState": async ({
    userId,
    projectId,
    boardId,
    nodeId,
    status,
  }) => {
    await updateUserBoardArrivalState(userId, projectId, boardId, {
      nodeId,
      status,
    });
  },

  "user.getUserVar": ({ userId, projectId, varName }) => {
    let userProjectData = getUserProjectData(userId, projectId);
    return userProjectData?.userVars?.[varName];
  },

  "user.setUserVar": async ({ userId /* can also be a Meteor selector */, projectId, varName, value }) => {
    console.log("user.setUserVar", userId, varName, value);
    const ret = await updateUsersVar(userId, projectId, varName, value);
    return ret
  },

  "user.setElementProperty": async ({
    userId,
    projectId,
    elementKey,
    propertyName,
    value,
  }) => {
    console.log("user.setElementProperty", propertyName, value);
    await updateUserElementProperty(
      userId,
      projectId,
      elementKey,
      propertyName,
      value
    );
  },

  "user.getElementProperty": async ({
    userId,
    projectId,
    elementKey,
    propertyName,
  }) => {
    console.log("user.getElementProperty", propertyName);
    let userProjectData = getUserProjectData(userId, projectId);
    let elementProperties = userProjectData.elementProperties;
    return elementProperties?.[elementKey]?.[propertyName];
  },

  "user.setChannelProperty": async ({
    userId,
    projectId,
    channelKey,
    propertyName,
    value,
  }) => {
    console.log("user.setChannelProperty", propertyName, value);
    await updateUserChannelProperty(
      userId,
      projectId,
      channelKey,
      propertyName,
      value
    );
  },

  "users.getForNode": ({ projectId, boardId, nodeId }) => {
    let nodeIdKey = `projectUserData.${projectId}.boardState.${boardId}.nodeId`;
    let statusKey = `projectUserData.${projectId}.boardState.${boardId}.status`;
    let query = { [nodeIdKey]: nodeId, [statusKey]: "arrived" };
    console.log("users.getForNode query", query);
    let users = Meteor.users.find(query).fetch();
    return users; /* TODO filter out blocked users and do not send sensivite fields */
  },

  "user.moveTo": async ({ projectId, userId, boardId, nodeId }) => {
    console.log("user.moveTo", projectId, userId, boardId, nodeId);
    let boardState = await getBoardState(projectId, userId, boardId, true);
    if (boardState) {
      const usersUpdatedCount = await updateUserBoardArrivalState(
        userId,
        projectId,
        boardId,
        { nodeId, status: "arriving" }
      );
      return usersUpdatedCount;
    }
    return false;
  },

  "users.moveTo": async ({ projectId, userIds, boardId, nodeId }) => {
    // TODO this is stupidly sequentialized, not efficient, and not DRY.
    console.log("users.moveTo", { projectId, userIds, boardId, nodeId });
    const successful = [];
    const errored = [];
    for (const userId of userIds) {
      let userBoardState = await getBoardState(projectId, userId, boardId, true);
      if (!userBoardState) {
        console.warn(`users.moveTo user ${userId} has no boardState`);
        continue;
      }
      if (!userBoardState[boardId]) {
        console.warn(
          `users.moveTo user ${userId} has no boardState for board ${boardId}`
        );
        continue;
      }
      const usersUpdatedCount = await updateUserBoardArrivalState(
        userId,
        projectId,
        boardId,
        { nodeId, status: "arriving" }
      );

      if (usersUpdatedCount === 1) {
        successful.push(userId);
      } else {
        errored.push(userId);
      }
    }
    return {
      successful,
      errored,
    };
  },

  "users.block": async ({ projectId, userIds, setBlocked }) => {
    let result;
    result = await Meteor.users.update(
      { _id: { $in: userIds } },
      { $set: { blocked: setBlocked } },
      { multi: true }
    );
    return result;
  },

  "user.setBoardInterface": async ({
    interfaceConfig,
    projectId,
    userId,
    boardId,
  }) => {
    let boardState = await getBoardState(projectId, userId, boardId, true);
    if (boardState) {
      boardState[boardId].interfaceConfig = interfaceConfig;
      await updateUserBoardInterface(
        userId,
        projectId,
        boardId,
        interfaceConfig
      );
    }
  },

  "user.registerProjectServerUser": async ({ projectId }) => {
    const username = "projectserver_" + projectId;
    let password = projectServerPasswords[projectId] || Random.secret();
    // TODO save this in project collection and expose only to admin and author
    projectServerPasswords[projectId] = password;
    seedUser("projectserver_" + projectId, password, "projectserver");
    return {
      username,
      password,
    };
  },

  "user.getRoles": async ({ userId }) => {
    const user = Meteor.users.findOne(userId);
    if (!user) return false;
    return {
      admin: userIsInRoles(userId, ["admin"]),
    };
  },

  "user.trackActivity": async function ({ url }) {
    
    const userId = Meteor.userId();
    const connectionId = this.connection.id;
    if (!userId || !connectionId) {
      console.warn("user.trackActivity missing userId or connectionId");
      return;
    }
    // console.log(
    //   "user.trackActivity",
    //   userId,
    //   url, connectionId
    // );
    
    processUserActivity({ userId, connectionId, url });
    
    return true;
  },
});
