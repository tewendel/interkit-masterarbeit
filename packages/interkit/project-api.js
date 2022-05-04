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

const echo = async function(msg, options) {
  const {message, server, projectId, nodeId, userId} = this
  
  const recipients = await server.call('users.getForNode', {projectId, boardId: message.channel_key, nodeId})
  const others = recipients.filter(u => u._id != userId)
  const otherIds = others.map(u => u._id)
  console.log("echo to otherIds", otherIds)
  
  server.call('message.send', {
    projectId, 
      channel_key: message.channel_key, 
      // sender: message.sender, // leaving sender empty for now, so that the sender doesn't see their message double
      recipients: otherIds,
      origin: "handler",
      payload: {...msg.payload, options}      
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

export default {
  send,
  sendText,
  sendChoice,
  moveTo,
  echo
}