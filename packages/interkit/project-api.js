const sendText = function(text, options) {
    const {message, server, projectId} = this
    //console.log(this)
    server.call('message.send', {
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
    })
}
const send = sendText;

const sendChoice = function(choice, options) {
  const {message, server, projectId} = this
  //console.log(this)
  server.call('message.send', {
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
  })
}

const moveTo = function(nodeId) { 
  const {server, projectId, boardId, userId} = this

  server.call('user.moveTo', {
    projectId,
    userId,
    boardId,
    nodeId
  })
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

const echo = async function(msg) {
  const {message, server, projectId, nodeId, userId} = this
  
  const recipients = await server.call('users.getForNode', {projectId, boardId: message.channel_key, nodeId})
  const others = recipients.filter(u => u._id != userId)
  const otherIds = others.map(u => u._id)
  console.log("echo to otherIds", otherIds)

  let name = await server.call('user.getUserVar', {userId, projectId, varName: "name"})
  
  server.call('message.send', {
    projectId, 
      channel_key: message.channel_key, 
      // sender: message.sender, // leaving sender empty for now, so that the sender doesn't see their message double
      recipients: otherIds,
      origin: "handler",
      payload: {...msg.payload, options: {label: name}}      
  })
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

export default {
  send,
  sendText,
  sendChoice,
  moveTo,
  echo,
  setUserVar,
  getUserVar,
  getRows,
  addRow,
  updateRow
}