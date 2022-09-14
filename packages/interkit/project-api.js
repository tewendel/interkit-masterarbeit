import pkg from 'geolib';
const { getDistance } = pkg;

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
      channel_key: message.channel_key, 
      //sender, 
      recipients: [message.sender],
      origin: "handler",
      payload: {
        type: 'text',
        text,
        options
      }
    }
    await callWithDelay(server, "message.send", methodParams, options)
}
const send = sendText;

const sendLink = async function (text, options) {
  const { message, server, projectId } = this
  const methodParams = {
    projectId,
    channel_key: message.channel_key,
    //sender,
    recipients: [message.sender],
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

const sendDots = async function (duration, options) {
  const { message, server, projectId } = this
  const methodParams = {
    projectId, 
    channel_key: message.channel_key, 
    //sender, 
    recipients: [message.sender],
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
    channel_key: message.channel_key,
    //sender,
    recipients: [message.sender],
    origin: "handler",
    payload: {
      type: "system",
      text,
      options,
    },
  };
  await callWithDelay(server, "message.send", methodParams, options);
};


const sendMediaFile = async function (callContext, type, mediafileKey, options) {
  const { message, server, projectId } = callContext
  console.log('sendImage', mediafileKey)
  const methodParams = {
    projectId,
    channel_key: message.channel_key,
    //sender,
    recipients: [message.sender],
    origin: "handler",
    payload: {
      type: type,
      // text,
      mediafileKey,
      options
    }
  }
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
    channel_key: message.channel_key, 
    //sender, 
    recipients: [message.sender],
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
      cancel: options?.cancel
    }
  }
  await callWithDelay(server, "message.send", methodParams, options)
}


const moveTo = async function(nodeId, options) { 
  const {server, projectId, boardId, userId} = this
  const methodParams = {
    projectId,
    userId,
    boardId: options?.channelKey || boardId, // you can optionally perform a moveTo on a different board
    nodeId
  }
  await callWithDelay(server, "user.moveTo", methodParams, options)
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

const setElementProperty = async function(elementKey, propertyName, value) {
  const {server, projectId, userId} = this
  await server.call('user.setElementProperty', {userId, projectId, elementKey, propertyName, value})
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
  return (pos1.lat && pos2.lat) ? 
    getDistance({latitude: pos1.lat, longitude: pos1.lng}, {latitude: pos2.lat, longitude: pos2.lng}, 1)
    : null 
}

export default {
  send,
  sendText,
  sendLink,
  sendSystem,
  sendImage,
  sendAudio,
  sendVideo,
  sendChoice,
  sendDots,
  moveTo,
  echo,
  setUserVar,
  getUserVar,
  setElementProperty,
  getElementProperty,
  setChannelProperty,
  getRows,
  addRow,
  updateRow,
  setInterface,
  requestLocation,
  distance
}
