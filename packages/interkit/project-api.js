import { getDistance } from 'geolib';

const callWithDelay = async (server, method, methodParams, options) => {
  try {
    if(options?.delay) {
      await server.call('events.schedule', {
        projectId: methodParams.projectId,
        method,
        delay: options.delay, 
        payload: methodParams 
      })
    } else {
      await server.call(method, methodParams)
    }
  } catch (error) {
    console.log("error callWithDelay", method, methodParams, error)
    return false
  }
}

const sendText = async function(text, options) {
    const {message, server, projectId} = this
    const methodParams = {
      projectId,
      channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
      //sender,
      recipients: options?.recipients || [message.sender],
      origin: "handler",
      payload: {
        type: "text",
        text,
        options,
      },
    };
    await callWithDelay(server, "message.send", methodParams, options)
}
const send = sendText;

const sendLink = async function (text, options) {
  const { message, server, projectId } = this
  const methodParams = {
    projectId,
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender,
    recipients: options?.recipients || [message.sender],
    origin: "handler",
    payload: {
      type: 'link',
      text,
      url: options?.url || text,
      options
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}

const sendLocation = async function (text, options) {
  const { message, server, projectId } = this
  const methodParams = {
    projectId,
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender,
    recipients: options?.recipients || [message.sender],
    origin: "handler",
    payload: {
      type: 'location',
      text,
      coords: {lat: options?.lat, lng: options?.lng},
      options
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}

const sendDots = async function (duration, options) {
  const { message, server, projectId } = this
  const methodParams = {
    projectId, 
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender, 
    recipients: options?.recipients || [message.sender],
    origin: 'handler',
    payload: {
      type: 'empty',
      typingDuration: duration
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}

const sendSystem = async function (text, options) {
  const { message, server, projectId } = this;
  const methodParams = {
    projectId,
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender,
    recipients: options?.recipients || [message.sender],
    origin: "handler",
    payload: {
      type: "system",
      text,
      options,
    },
  };
  await callWithDelay(server, "message.send", methodParams, options);
};

const sendSystemImage = async function ( mediafileKey, options) {
  await sendMediaFile(this, "systemImage", mediafileKey, options);
};


const sendMediaFile = async function (callContext, type, mediafileKey, options) {
  const { message, server, projectId } = callContext
  console.log('sendMediaFile', mediafileKey)
  const methodParams = {
    projectId,
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender,
    recipients: options?.recipients || [message.sender],
    origin: "handler",
    payload: {
      type: type,
      // text,
      mediafileKey,
      options,
    },
  };
  await callWithDelay(server, "message.send", methodParams, options)
}

const sendImage = async function (mediafileKey, options) {
  await sendMediaFile(this, "image", mediafileKey, options)
}

const sendAudio = async function (mediafileKey, options) {
  await sendMediaFile(this, "audio", mediafileKey, options)
}

const sendVideo = async function (mediafileKey, options) {
  await sendMediaFile(this, "video", mediafileKey, options)
}


const sendChoice = async function(choice, options) {
  const {message, server, projectId} = this
  //console.log(this)
  const methodParams = {
    projectId, 
    channel_key: options?.channelKey || message.channel_key, // optionally send this message on a different channel
    //sender, 
    recipients: options?.recipients || [message.sender],
    origin: "handler",
    payload: {
      type: 'choice',
      choice,
      options
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}

const requestLocation = async function(prompt, options) {
  const {message, server, projectId} = this
  //console.log(this)
  const methodParams = {
    projectId, 
    channel_key: message.channel_key, 
    //sender, 
    recipients: [message.sender],
    origin: "handler",
    payload: {
      type: 'requestLocation',
      prompt: prompt,
      cancel: options?.cancel,
      options
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}


const moveTo = async function(nodeId, options) { 
  if (options?.recipients) {
    // make sure the context ("this") is not lost
    const boundMoveUsers = moveUsers.bind(this);
    return await boundMoveUsers(nodeId, options.recipients, options);
  }

  const {server, projectId, boardId, userId} = this
  const methodParams = {
    projectId,
    userId,
    boardId: options?.channelKey || boardId, // you can optionally perform a moveTo on a different board
    nodeId
  }
  await callWithDelay(server, "user.moveTo", methodParams, options)
}

const moveUsers = async function(nodeId, recipients = [], options) {
  const {server, projectId, boardId} = this

  // recipients might be a nodeId
  if (recipients?.nodeId) {
    const users = await server.call('users.getForNode', {
      projectId, 
      boardId: recipients?.channelKey || boardId, 
      nodeId: recipients?.nodeId
    })
    recipients = users.map((u) => u._id);
  }

  const methodParams = {
    projectId,
    userIds: recipients,
    boardId: options?.channelKey || boardId, // you can optionally perform a moveTo on a different board
    nodeId
  }
  await callWithDelay(server, "users.moveTo", methodParams, options)
}


const getUserVar = async function(varName) {
  const {message, server, projectId, nodeId, userId} = this
  let value = await server.call('user.getUserVar', {userId, projectId, varName})
  return value;
}

const setUserVar = async function(varName, value) {
  const {message, server, projectId, nodeId, userId} = this
  await server.call('user.setUserVar', {userId, projectId, varName, value})
}

const requestResetAllOtherUsers = async function () {
  const { message, server, projectId, nodeId, userId } = this
  const ret = await server.call('user.setUserVar', {
    // user.setUserVar userId coincidentally, untypedly takes a Meteor selector
    userId: {
      _id: { $ne: userId },
      [`projectUserData.${projectId}.boardState`]: { $exists: true, $ne: null },
      [`projectUserData.${projectId}.userVars.resetRequested`]: { $ne: true }
    },
    projectId,
    varName: 'resetRequested',
    value: true
  })
  console.log('requestResetAllOtherUsers', userId, ret)
  return ret
}

const setLang = async function (lang, langIndex) {
  // TODO as implemented now, user must know both lang and its index
  // in the langs array, which is provided by a blockly field,
  // and thus hard to know here, in a node handler.
  // this is not ideal. either
  // - langs have to be published to the server from blocky somehow, or
  // - langs could be provided/defined somewhere else
  // - we stop relying on langIndex
  const { server, projectId, nodeId, userId } = this
  await server.call('user.updateUserProjectData', { userId, projectId, key: 'lang', value: lang })
  await server.call('user.updateUserProjectData', { userId, projectId, key: 'langIndex', value: langIndex })
}

const setElementProperty = async function(elementKey, propertyName, value, options) {
  const {server, projectId, userId} = this
  const methodParams = {
    userId,
    projectId, 
    elementKey,
    propertyName,
    value
  }
  await callWithDelay(server, 'user.setElementProperty', methodParams, options)
}

const getElementProperty = async function(elementKey, propertyName) {
  const {server, projectId, userId} = this
  let value = await server.call('user.getElementProperty', {userId, projectId, elementKey, propertyName})
  return value;
}

const setChannelProperty = async function(channelKey, propertyName, value) {
  const {server, projectId, userId} = this
  await server.call('user.setChannelProperty', {userId, projectId, channelKey, propertyName, value})
}

const echo = async function(msg) {
  const {message, server, projectId, nodeId, userId} = this
  
  const recipients = await server.call('users.getForNode', {projectId, boardId: message.channel_key, nodeId})
  const others = recipients.filter(u => u._id != userId)
  const otherIds = others.map(u => u._id)
  console.log("echo to otherIds", otherIds)

  try {
    let name = await server.call('user.getUserVar', {userId, projectId, varName: "name"})
    server.call('message.send', {
      projectId, 
        channel_key: message.channel_key, 
        // sender: message.sender, // leaving sender empty for now, so that the sender doesn't see their message double
        recipients: otherIds,
        origin: "handler",
        payload: {...msg.payload, options: {label: name}}      
    })
  } catch(error) {
    console.log("api.echo error", error)
  }
}

const getUsersInNode = async function (options) {
  const { message, server, projectId, nodeId, userId } = this;
  const users = await server.call("users.getForNode", {
    projectId,
    boardId: options?.channelKey || message.channel_key,
    nodeId: options?.nodeId || nodeId,
  });
  return users;
};

// load all the rows in a sheet
const getRows = async function(sheetKey) {
  const {server, projectId} = this
  const rows = await server.call('sheet.getRows', {sheetKey, projectId})  
  return rows;
}

// create a new row with values
const addRow = async function(sheetKey, values) {
  const {server, projectId} = this
  const rowKey = await server.call('sheet.addRow', {sheetKey, projectId})
  await server.call('row.updateValues', {projectId, rowKey: rowKey.rowKey, values});
}

// update a row
const updateRow = async function(sheetKey, rowKey, values) {
  const {server, projectId} = this
  await server.call('row.updateValues', {projectId, rowKey, values});
}


// set interface for this board
const setInterface = async function(interfaceConfig) {
  const {server, projectId, boardId, userId} = this
  await server.call('user.setBoardInterface', {interfaceConfig, projectId, userId, boardId})
}

const distance = (pos1, pos2) => { 
  return (pos1?.lat && pos2?.lat) ? 
    getDistance({latitude: pos1.lat, longitude: pos1.lng}, {latitude: pos2.lat, longitude: pos2.lng}, 1)
    : null 
}

export default {
  send,
  sendText,
  sendLink,
  sendSystem,
  sendSystemImage,
  sendImage,
  sendAudio,
  sendVideo,
  sendChoice,
  sendDots,
  sendLocation,
  moveTo,
  moveUsers,
  echo,
  getUsersInNode,
  setUserVar,
  getUserVar,
  requestResetAllOtherUsers,
  setLang,
  setElementProperty,
  getElementProperty,
  setChannelProperty,
  getRows,
  addRow,
  updateRow,
  setInterface,
  requestLocation,
  distance,
};
